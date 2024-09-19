import React, { useState, useEffect, useRef } from "react";
import { useClassOverride, fetcher } from "../utils/index";
import { MagicSearchProps, Message } from "../utils/types";
import {
  MAGIC_SEARCH_ID,
  HEADER_ID,
  CLOSE_BUTTON_ID,
  TAB,
  MAGIC_SEARCH_CONTENT_ID,
} from "../utils/constants";
import Home from "../screens/Home";
import Results from "../screens/Results";
import TabIcon from "./TabIcon";
import NavButton from "./NavButton";
import { useConfiguration } from "../context/ConfigurationProvider";
import { twMerge } from "tailwind-merge";

// Other
const BOT_ROLE = "assistant";
const USER_ROLE = "user";

let buffer = "";
let isCitation = false;
let citationIndex = 0;
const citationIndexMap: { [key in string]: number } = {};
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
          result += ` <a class="magic-search-citation" href="${citation}" target="_blank">[${citationIndexMap[citation]}]</a> `;
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

const bodyClassesLeft = ["ml-0", "md:ml-72", "lg:ml-96"];
const bodyClassesRight = ["mr-0", "md:mr-72", "lg:mr-96"];

const MagicSearch = ({
  direction,
  shiftBody = true,
  publicKey,
}: MagicSearchProps) => {
  const configuration = useConfiguration();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previewSearchRef = useRef<string>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [articles, setArticles] = useState<{ [key in number]: any[] }>({});
  const [showMagicSearch, setShowMagicSearch] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetcher("/content/v1/search/questions", publicKey, {
      content: document.getElementsByTagName("body")[0]?.innerText,
    }).then((res: Response) => {
      if (!res.ok) {
        return;
      }
      res.json().then((data) => {
        setPrompts(data);
      });
    });
  }, []);

  useEffect(() => {
    if (shiftBody) {
      document.body.style.transition = `${direction === "left" ? "margin-left" : "margin-right"} 0.5s`;
    }
  }, []);

  useEffect(() => {
    // Shift page body on open/close
    if (showMagicSearch && shiftBody) {
      document.body.classList.add(
        ...(direction === "left" ? bodyClassesLeft : bodyClassesRight),
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
      // Set the new page to the last page
      setPage(Math.ceil(messages.length / 2));
      const lastSearchValue = messages[messages.length - 1].content;
      fetcher("/content/v1/search/articles", publicKey, {
        query: lastSearchValue,
        numberOfResults: 10,
      }).then((res: Response) => {
        if (!res.ok) {
          return;
        }
        res.json().then((data) => {
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
        const stream = await fetcher("/content/v1/search/summary", publicKey, {
          articles: mostRecentArticles,
          messages,
          query: lastMessage.content,
        });
        const reader = stream?.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

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
        `fixed bg-[#F4F4F4] [transition:0.5s] w-[480px] text-[#595959] top-0  translate-x-full ${direction === "left" ? `left-0 ${showMagicSearch ? "translate-x-0" : "-translate-x-full"}` : `right-0 ${showMagicSearch ? "translate-x-0" : "translate-x-full"}`} ${useClassOverride(MAGIC_SEARCH_ID)}`,
      )}
    >
      <div
        className={twMerge(
          `overflow-y-scroll h-screen ${useClassOverride(MAGIC_SEARCH_CONTENT_ID)}`,
        )}
      >
        <div
          className={twMerge(
            `bg-white flex justify-between items-center px-4 py-5 ${useClassOverride(HEADER_ID)}`,
          )}
        >
          <button
            className={`h-14 w-14 rounded-full bg-white shadow-md`}
            onClick={() => setShowMagicSearch(false)}
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
              className="mx-auto my-0 stroke-[#595959]"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div className="flex justify-center items-center">
            <NavButton
              direction="forward"
              // Disable the next button if we don't have messages or if we are at the last page
              disabled={messages.length === 0 || page * 2 === messages.length}
              onClick={() => setPage((prevPage) => prevPage + 1)}
            />
            <NavButton
              direction="backward"
              disabled={page === 0}
              onClick={() => setPage((prevPage) => prevPage - 1)}
            />
          </div>
        </div>
        <Home
          shouldShow={page === 0}
          prompts={prompts}
          searchInputRef={searchInputRef}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          submitSearch={submitSearch}
        />
        {messages.map((message, index) => {
          if (message.role !== USER_ROLE) {
            return;
          }

          return (
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
            />
          );
        })}
        <div
          className={`absolute top-0 ${direction === "left" ? "right-px" : "-left-[39px]"}`}
        >
          <div
            role="button"
            className={`${TAB} ${useClassOverride(TAB)}`}
            onClick={() => setShowMagicSearch(!showMagicSearch)}
          >
            <TabIcon direction={direction} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicSearch;
