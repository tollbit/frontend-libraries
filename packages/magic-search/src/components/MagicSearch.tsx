import React, { useState, useEffect, useRef } from "react";
import { getClassOverride, fetcher } from "../utils/index";
import { MagicSearchProps, Message } from "../utils/types";
import {
  MAGIC_SEARCH_ID,
  HEADER_ID,
  CLOSE_BUTTON_ID,
  TAB,
} from "../utils/constants";
import Home from "../screens/Home";
import Results from "../screens/Results";
import TabIcon from "./TabIcon";
import NavButton from "./NavButton";

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
        const citationList = citation.split(";");
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

const MagicSearch = ({
  direction,
  shiftBody = true,
  publicKey,
  configuration = { classes: {}, copy: {} },
}: MagicSearchProps) => {
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
    // Shift page body on open/close
    if (showMagicSearch && shiftBody) {
      document.body.style[direction === "left" ? "marginLeft" : "marginRight"] =
        "300px";
    }
    if (!showMagicSearch && shiftBody) {
      document.body.style[direction === "left" ? "marginLeft" : "marginRight"] =
        "0";
    }
    if (searchInputRef.current && showMagicSearch) {
      searchInputRef.current.focus();
    }
  }, [showMagicSearch]);

  useEffect(() => {
    // If we just appended a user message, we should fetch the articles for that prompt
    if (messages[messages.length - 1]?.role === USER_ROLE) {
      setPage((prevPage) => prevPage + 1);
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
      className={`${MAGIC_SEARCH_ID} ${direction === "left" ? `${MAGIC_SEARCH_ID}-left` : `${MAGIC_SEARCH_ID}-right`} ${showMagicSearch ? "magic-search-show" : "magic-search-hide"}${getClassOverride(MAGIC_SEARCH_ID, configuration.classes)}`}
    >
      <div className="magic-search-content">
        <div
          className={`${HEADER_ID} ${getClassOverride(HEADER_ID, configuration.classes)}`}
        >
          <button
            className={`${CLOSE_BUTTON_ID} ${direction === "left" ? `${CLOSE_BUTTON_ID}-left` : `${CLOSE_BUTTON_ID}-right`}`}
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
              className="lucide lucide-x magic-search-close-icon"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div className="magic-search-nav-button-container">
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
          configuration={configuration}
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
              configuration={configuration}
              submitSearch={submitSearch}
            />
          );
        })}
        <div
          className={`magic-search-tab-container  ${direction === "left" ? "magic-search-tab-container-left" : "magic-search-tab-container-right"}`}
        >
          <div
            role="button"
            className={`${TAB} ${getClassOverride(TAB, configuration.classes)}`}
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
