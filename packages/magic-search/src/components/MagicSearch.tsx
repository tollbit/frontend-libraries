import { useState, useEffect, useRef } from "react";
import { getClassOverride, fetcher, twMerge } from "../utils";
import { MagicSearchProps, Message } from "../utils/types";
import {
  MAGIC_SEARCH_ID,
  HEADER_ID,
  TAB,
  MAGIC_SEARCH_CONTENT_ID,
} from "../utils/constants";
import Home from "../screens/Home";
import Results from "../screens/Results";
import TabIcon from "./TabIcon";
import NavButton from "./NavButton";
import { useLogger } from "../context/LoggerProvider";
import ErrorBoundary from "./ErrorBoundary";
import { useTracker } from "../context/TrackerProvider";
import { useConfiguration } from "../context/ConfigurationProvider";
import SearchIcon from "../icons/SearchIcon";

// Other
const BOT_ROLE = "assistant";
const USER_ROLE = "user";

let buffer = "";
let isCitation = false;
let citationIndex = 0;
const citationIndexMap: { [_key in string]: number } = {};
const processMessage = (msg: string) => {
  let result = "";
  for (let char of msg) {
    if (char === "(") {
      isCitation = true;
      buffer += char;
      continue;
    }

    if (isCitation) {
      buffer += char;
      if (char === ")") {
        isCitation = false;
        const citation = buffer.slice(1, -1);
        const citationList = citation.split(";").map((c) => c.trim());
        citationList.forEach((citation) => {
          if (!citationIndexMap[citation]) {
            citationIndexMap[citation] = citationIndex + 1;
          }
          result += `<a class="magic-search-citation" href="${citation}" target="_blank">[${citationIndexMap[citation]}]</a>`;
          citationIndex++;
        });
        buffer = "";
      }
    } else {
      result += char;
    }
  }
  return result;
};

const bodyClassesLeft = ["tb-ml-0", "md:tb-ml-72", "lg:tb-ml-96"];
const transitionClassesLeft = [
  "tb-transition-[margin-left]",
  "tb-duration-500",
];
const bodyClassesRight = ["tb-mr-0", "md:tb-mr-72", "lg:tb-mr-96"];
const transitionClassesRight = [
  "tb-transition-[margin-right]",
  "tb-duration-500",
];

const MagicSearch = ({
  direction,
  shiftBody = true,
  publicKey,
}: MagicSearchProps) => {
  const logger = useLogger();
  const tracker = useTracker();
  const configuration = useConfiguration();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previewSearchRef = useRef<string>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [articles, setArticles] = useState<{ [_key in number]: any[] }>({});
  const [showMagicSearch, setShowMagicSearch] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [page, setPage] = useState(0);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const stopStream = useRef(false);
  const setStopStream = (stop: boolean) => (stopStream.current = stop);

  useEffect(() => {
    if (showMagicSearch && !prompts.length) {
      fetcher({
        path: "/content/v1/search/questions",
        key: publicKey,
        body: {
          content: document.getElementsByTagName("body")[0]?.innerText,
        },
        host: configuration.host,
      }).then((res: Response) => {
        if (!res.ok) {
          logger.error("Failed to fetch prompts", { status: res.status });
          return;
        }
        res.json().then((data) => {
          if (!data) {
            logger.info("No prompts found");
          }
          setPrompts(data);
        });
      });
    }
  }, [showMagicSearch, prompts]);

  useEffect(() => {
    if (showMagicSearch) {
      tracker.trackPageview();
    }
  }, [showMagicSearch]);

  useEffect(() => {
    // Shift page body on open/close
    if (showMagicSearch && shiftBody) {
      document.body.classList.add(
        ...(direction === "left"
          ? [...bodyClassesLeft, ...transitionClassesLeft]
          : [...bodyClassesRight, ...transitionClassesRight]),
      );
    }

    if (!showMagicSearch && shiftBody) {
      if (direction === "left") {
        document.body.classList.remove(...bodyClassesLeft);
      }
      if (direction === "right") {
        document.body.classList.remove(...bodyClassesRight);
      }
    }
    if (searchInputRef.current && showMagicSearch) {
      searchInputRef.current.focus();
    }
  }, [showMagicSearch]);

  useEffect(() => {
    // If we just appended a user message, we should fetch the articles for that prompt
    if (messages[messages.length - 1]?.role === USER_ROLE) {
      const lastSearchValue = messages[messages.length - 1].content;
      // Track the new search
      tracker.trackEvent("search", {
        props: { searchValue: lastSearchValue, page },
      });
      setIsStreamActive(true);
      // Set the new page to the last page
      setPage(Math.ceil(messages.length / 2));
      fetcher({
        path: "/content/v1/search/articles",
        key: publicKey,
        body: {
          query: lastSearchValue,
          numberOfResults: 10,
        },
        host: configuration.host,
      }).then((res: Response) => {
        if (!res.ok) {
          logger.error("Failed to fetch articles", { status: res.status });
          return;
        }
        res.json().then((data) => {
          if (!data) {
            logger.info("No articles found", { query: lastSearchValue });
          }
          setArticles((prevState) => ({
            ...prevState,
            [messages.length - 1]: data,
          }));
          previewSearchRef.current = lastSearchValue;
          // @ts-expect-error
          searchInputRef?.current.value = "";
        });
      });
    }
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const mostRecentArticles = articles[messages.length - 1];
    if (
      lastMessage?.role === USER_ROLE &&
      mostRecentArticles &&
      mostRecentArticles.length > 0
    ) {
      const fetchAnswer = async () => {
        const stream = await fetcher({
          path: "/content/v1/search/summary",
          key: publicKey,
          body: {
            articles: mostRecentArticles,
            messages,
            query: lastMessage.content,
          },
          host: configuration.host,
        });
        const reader = stream?.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setIsStreamActive(false);
            break;
          }
          // Stop the stream if the user presses the stop button
          if (stopStream.current) {
            setStopStream(false);
            setIsStreamActive(false);
            // If the stream hasnt started to process the message we need to add an empty bot message to keep the order of the messages user -> bot -> user -> bot
            setMessages((prevMessages) => {
              if (prevMessages[prevMessages.length - 1]?.role !== BOT_ROLE) {
                return [
                  ...prevMessages,
                  {
                    role: BOT_ROLE,
                    content: "",
                  },
                ];
              }
              return prevMessages;
            });
            reader.cancel();
            break;
          }
          setMessages((prevMessages) => {
            if (prevMessages[prevMessages.length - 1]?.role === BOT_ROLE) {
              return [
                ...prevMessages.slice(0, -1),
                {
                  role: BOT_ROLE,
                  content:
                    prevMessages[prevMessages.length - 1].content +
                    processMessage(decoder.decode(value, { stream: true })),
                },
              ];
            } else {
              return [
                ...prevMessages,
                {
                  role: BOT_ROLE,
                  content: processMessage(
                    decoder.decode(value, { stream: true }),
                  ),
                },
              ];
            }
          });
        }
      };
      fetchAnswer();
    }
  }, [articles]);

  const submitSearch = (value: string) => {
    setMessages((prevState) => [
      ...prevState,
      { role: USER_ROLE, content: value || searchTerm },
    ]);
    setSearchTerm("");
  };

  return (
    <div
      className={twMerge(
        `tb-fixed tb-bg-[#F4F4F4] [transition:0.5s] w-screen sm:tb-w-[480px] tb-text-[#595959] tb-bottom-0 tb-z-[100]  tb-drop-shadow-lg`,
        direction === "left"
          ? `tb-left-0 ${showMagicSearch ? "tb-translate-x-0" : "-tb-translate-x-full"}`
          : `tb-right-0 ${showMagicSearch ? "tb-translate-x-0" : "tb-translate-x-full"}`,
        configuration.showFloatingActionButton?.desktop
          ? `md:tb-translate-y-full ${showMagicSearch ? "md:tb-translate-y-0" : ""}`
          : "",
        configuration.showFloatingActionButton?.mobile
          ? `tb-translate-y-full ${showMagicSearch ? "tb-translate-y-0" : ""}`
          : "",
        getClassOverride(MAGIC_SEARCH_ID, configuration),
      )}
    >
      <div
        className={twMerge(
          `tb-overflow-y-scroll tb-h-screen ${getClassOverride(MAGIC_SEARCH_CONTENT_ID, configuration)}`,
        )}
      >
        <div
          className={twMerge(
            `tb-bg-white tb-flex tb-justify-between tb-items-center tb-px-4 tb-py-5 ${getClassOverride(HEADER_ID, configuration)}`,
          )}
        >
          <button
            className={`tb-h-14 tb-w-14 tb-rounded-full tb-bg-white tb-shadow-md`}
            onClick={() => {
              tracker.trackEvent("close", { page });
              setShowMagicSearch(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-mx-auto tb-my-0 tb-stroke-[#595959]"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div className="tb-flex tb-justify-center tb-items-center">
            <NavButton
              direction="forward"
              // Disable the next button if we don't have messages or if we are at the last page
              disabled={messages.length === 0 || page * 2 === messages.length}
              onClick={() => {
                tracker.trackEvent("next", { props: { page } });
                setPage((prevPage) => prevPage + 1);
              }}
            />
            <NavButton
              direction="backward"
              disabled={page === 0}
              onClick={() => {
                tracker.trackEvent("back", { props: { page } });
                setPage((prevPage) => prevPage - 1);
              }}
            />
          </div>
        </div>
        <ErrorBoundary>
          <Home
            shouldShow={page === 0}
            prompts={prompts}
            searchInputRef={searchInputRef}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            submitSearch={submitSearch}
            isStreamActive={isStreamActive}
            setStopStream={setStopStream}
          />
        </ErrorBoundary>
        {messages.map((message, index) => {
          if (message.role !== USER_ROLE) {
            return;
          }

          return (
            <ErrorBoundary key={index}>
              <Results
                key={index}
                // Each page corresponds to a given user message. Page 1 corresponds to message 0, page 2 corresponds to message 2, page 3 corresponds to message 4, etc.
                shouldShow={(page - 1) * 2 === index}
                chatResponse={messages[index + 1]?.content}
                articles={articles[index] || []}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchInputRef={searchInputRef}
                lastSearchValue={message.content}
                submitSearch={submitSearch}
                isStreamActive={isStreamActive}
                setStopStream={setStopStream}
              />
            </ErrorBoundary>
          );
        })}
        <div
          className={`${configuration.showFloatingActionButton?.mobile ? "tb-hidden" : "tb-block"}
           ${configuration.showFloatingActionButton?.desktop ? " md:tb-hidden" : "md:tb-block"}
           tb-absolute tb-top-0 ${direction === "left" ? "tb-right-0 tb-translate-x-[calc(100%-1px)]" : "-tb-translate-x-[calc(100%-1px)]"}`}
        >
          <div
            role="button"
            aria-label="Open Magic Search"
            className={getClassOverride(TAB, configuration)}
            onClick={() => {
              setShowMagicSearch(!showMagicSearch);
            }}
          >
            <TabIcon
              direction={direction}
              gradient={configuration.tabGradient}
            />
          </div>
        </div>
      </div>
      <div
        aria-label="Open Magic Search"
        className={twMerge(
          "tb-absolute tb-transition-opacity tb-delay-500 tb-duration-200 tb-drop-shadow-lg -tb-top-20 -tb-left-20 tb-w-14 tb-h-14 tb-items-center tb-rounded-full tb-bg-gradient-to-br tb-from-[#8d57d9] tb-to-[#f4567b]",
          configuration.showFloatingActionButton?.mobile
            ? "tb-flex"
            : "tb-hidden",
          configuration.showFloatingActionButton?.desktop
            ? "md:tb-flex"
            : "md:tb-hidden",
          showMagicSearch
            ? "tb-opacity-0 tb-invisible md:tb-invisible"
            : "tb-opacity-100",
        )}
        role="button"
        onClick={() => {
          setShowMagicSearch(!showMagicSearch);
        }}
      >
        <SearchIcon className="tb-mx-auto" />
      </div>
    </div>
  );
};

export default MagicSearch;
