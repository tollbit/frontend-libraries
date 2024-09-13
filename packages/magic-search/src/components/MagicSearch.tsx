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

// Other
const BOT_ROLE = "assistant";
const USER_ROLE = "user";

const MagicSearch = ({
  direction,
  publicKey,
  configuration = { classes: {}, copy: {} },
}: MagicSearchProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previewSearchRef = useRef<string>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearchValue, setLastSearchValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [articles, setArticles] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [showMagicSearch, setShowMagicSearch] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [chatResponse, setChatResponse] = useState("");

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
    if (searchInputRef.current && showMagicSearch) {
      searchInputRef.current.focus();
    }
  }, [showMagicSearch]);

  useEffect(() => {
    if (lastSearchValue !== previewSearchRef.current) {
      setMessages((prevState) => [
        ...prevState,
        { role: USER_ROLE, content: lastSearchValue || "" },
      ]);
      fetcher("/content/v1/search/articles", publicKey, {
        query: lastSearchValue,
        numberOfResults: 10,
      }).then((res: Response) => {
        if (!res.ok) {
          return;
        }
        res.json().then((data) => {
          setArticles(data);
          previewSearchRef.current = lastSearchValue;
          // @ts-expect-error
          searchInputRef?.current.value = "";
        });
      });
    }
  }, [lastSearchValue]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === USER_ROLE && articles.length > 0) {
      const fetchAnswer = async () => {
        const stream = await fetcher("/content/v1/search/summary", publicKey, {
          articles,
          messages,
          query: lastMessage.content,
        });
        const reader = stream?.body?.getReader();
        const decoder = new TextDecoder();
        let result = "";
        if (!reader) return;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
          setChatResponse(
            (prevResponse) =>
              prevResponse + decoder.decode(value, { stream: true }),
          );
        }
        setMessages((prevState) => [
          ...prevState,
          { role: BOT_ROLE, content: chatResponse },
        ]);
      };
      fetchAnswer();
    }
  }, [messages, articles]);

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
        </div>
        {!lastSearchValue ? (
          <Home
            prompts={prompts}
            searchInputRef={searchInputRef}
            configuration={configuration}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setLastSearchValue={setLastSearchValue}
            publicKey={publicKey}
          />
        ) : (
          <Results
            chatResponse={chatResponse}
            articles={articles}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchInputRef={searchInputRef}
            lastSearchValue={lastSearchValue}
            configuration={configuration}
            setLastSearchValue={setLastSearchValue}
          />
        )}
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
