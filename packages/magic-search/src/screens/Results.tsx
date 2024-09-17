import React, { useEffect, useRef, useState } from "react";
import { getClassOverride } from "../utils";
import {
  ARTICLES_ID,
  ARTICLES_TITLE_ID,
  CHAT_ID,
  SEE_MORE_BUTTON_BACKGROUND_ID,
  SEE_MORE_BUTTON_ID,
} from "../utils/constants";
import { MagicSearchConfiguration } from "../utils/types";
import Article from "../components/Article";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";

const Results = ({
  shouldShow,
  chatResponse,
  articles,
  searchTerm,
  setSearchTerm,
  submitSearch,
  searchInputRef,
  lastSearchValue,
  configuration,
}: {
  shouldShow: boolean;
  chatResponse: string;
  articles: any[];
  lastSearchValue: string;
  configuration: MagicSearchConfiguration;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  submitSearch: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}) => {
  const articlesRef = useRef<HTMLDivElement>(null);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [articlesHeight, setArticlesHeight] = useState("180px");

  useEffect(() => {
    if (articlesRef.current && articles.length > 0) {
      setArticlesHeight(articlesRef.current.scrollHeight + "px");
    }
  }, [shouldShowMore, articles]);

  const filteredArticles = shouldShowMore ? articles : articles.slice(0, 3);

  return (
    <div
      className={`magic-search-results ${shouldShow ? "magic-search-page-show" : "magic-search-page-hide"}`}
    >
      <div className="magic-search-last-search">{lastSearchValue}</div>
      <div
        ref={articlesRef}
        style={{ height: articlesHeight }}
        className={`${ARTICLES_ID} ${getClassOverride(ARTICLES_ID, configuration.classes)}`}
      >
        <div
          className={`${ARTICLES_TITLE_ID} ${getClassOverride(ARTICLES_TITLE_ID, configuration.classes)}`}
        >
          {configuration?.copy?.searchResultsTitle || "TOP RESULTS"}
        </div>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article: any) => (
            <Article key={article.title} {...article} />
          ))
        ) : (
          <LoadingSpinner />
        )}
      </div>
      {!shouldShowMore && articles?.length > 0 && (
        <div
          className={`${SEE_MORE_BUTTON_BACKGROUND_ID} ${getClassOverride(SEE_MORE_BUTTON_BACKGROUND_ID, configuration)}`}
        >
          <button
            onClick={() => setShouldShowMore(true)}
            className={`${SEE_MORE_BUTTON_ID} ${getClassOverride(SEE_MORE_BUTTON_ID, configuration)}`}
          >
            {configuration?.copy?.showMoreButton || "SEE MORE RESULTS"}
          </button>
        </div>
      )}
      <div
        className={`${CHAT_ID} ${getClassOverride(CHAT_ID, configuration.classes)}`}
      >
        {chatResponse?.length > 0 ? (
          // @TODO Can we do anything better here for streaming the response with embedded links? Maybe a markdown renderer
          <div
            className="magic-search-streamed-message"
            dangerouslySetInnerHTML={{ __html: chatResponse }}
          />
        ) : (
          <>
            <div className="magic-search-shimmer" style={{ width: "180px" }} />
            <div className="magic-search-shimmer" style={{ width: "240px" }} />
            <div className="magic-search-shimmer" style={{ width: "320px" }} />
            <div className="magic-search-shimmer" style={{ width: "380px" }} />
          </>
        )}
      </div>
      <SearchBar
        configuration={configuration}
        value={searchTerm}
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        handleSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          submitSearch(searchTerm);
        }}
        inputWrapClassNames="magic-search-chat-input-wrap"
        innerRef={searchInputRef}
      />
    </div>
  );
};

export default Results;
