import React, { useState, useEffect, useRef } from "react";
import { getClassOverride } from "../utils";
import { MagicSearchProps, Message } from "../utils/types";
import {
  MAGIC_SEARCH_ID,
  HEADER_ID,
  CLOSE_BUTTON_ID,
  TAB,
} from "../utils/constants";
import Home from "../screens/Home";
import Results from "../screens/Results";

// Other
const BOT_ROLE = "assistant";
const USER_ROLE = "user";

const fetcher = async (path: string, key: string, body: object) =>
  fetch(`https://pre-api.tollbit.com${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      TollbitPublicKey: key,
    },
    body: JSON.stringify(body),
  });

const MagicSearch = ({
  direction,
  publicKey,
  configuration = { classes: {}, copy: {}, headerImage: "" },
}: MagicSearchProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [articles, setArticles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [showMagicSearch, setShowMagicSearch] = useState(false);
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    fetcher("/content/v1/search/questions", publicKey, {
      content: document.getElementsByTagName("body")[0]?.innerText,
    }).then((res) => {
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
    if (searchInputRef?.current?.value !== "" && isSubmitting) {
      setMessages([
        ...messages,
        { role: USER_ROLE, content: searchInputRef?.current?.value || "" },
      ]);
      fetcher("/content/v1/search/articles", publicKey, {
        query: searchInputRef?.current?.value,
      }).then((res) => {
        if (!res.ok) {
          return;
        }
        res.json().then((data) => {
          setArticles(data);
          setIsSubmitting(false);
        });
      });
    }
  }, [isSubmitting]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === USER_ROLE) {
      fetcher("/content/v1/search/summary", publicKey, {
        articles,
        messages,
        query: lastMessage.content,
      });
    }
  }, [messages]);

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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x magic-search-close-icon"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          {configuration.headerImage && (
            <img
              src={configuration.headerImage}
              alt="Magic Search Header Image"
              className="magic-search-header-image"
            />
          )}
        </div>
        {articles.length === 0 ? (
          <Home
            prompts={prompts}
            searchInputRef={searchInputRef}
            configuration={configuration}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setIsSubmitting={setIsSubmitting}
          />
        ) : (
          <Results
            articles={articles}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setIsSubmitting={setIsSubmitting}
            searchInputRef={searchInputRef}
            lastSearchValue={messages[messages.length - 1]?.content}
            configuration={configuration}
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
            <svg
              width="26"
              height="151"
              viewBox="0 0 26 151"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.5 146.145C24.769 145.217 23.7999 144.487 22.6804 144.044L3.34394 136.391C1.62746 135.712 0.5 134.053 0.5 132.207V19.0274C0.5 17.1965 1.60928 15.5482 3.30539 14.8587L20.9179 7.69914C22.8787 6.90203 24.4814 5.47219 25.5 3.67667V146.145Z"
                fill="#343434"
                stroke="#343434"
              />
            </svg>
          </div>
          <div className="magic-search-border" />
        </div>
      </div>
    </div>
  );
};

export default MagicSearch;
