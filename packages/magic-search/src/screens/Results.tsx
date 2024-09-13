import React, { useEffect, useRef, useState } from "react";
import { getClassOverride } from "../utils";
import { ARTICLES_ID, CHAT_ID } from "../utils/constants";
import { MagicSearchConfiguration } from "../utils/types";
import Article from "../components/Article";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
const Results = ({
  chatResponse,
  articles,
  searchTerm,
  setSearchTerm,
  setLastSearchValue,
  searchInputRef,
  lastSearchValue,
  configuration,
}: {
  chatResponse: string;
  articles: any[];
  lastSearchValue: string;
  configuration: MagicSearchConfiguration;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setLastSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchInputRef: React.RefObject<HTMLInputElement>;
}) => {
  const articlesRef = useRef<HTMLDivElement>(null);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [articlesHeight, setArticlesHeight] = useState("180px");

  useEffect(() => {
    if (articlesRef.current) {
      setArticlesHeight(articlesRef.current.scrollHeight + "px");
    }
  }, [shouldShowMore, articles]);

  const filteredArticles = shouldShowMore ? articles : articles.slice(0, 3);

  return (
    <>
      <div className="magic-search-last-search">{lastSearchValue}</div>
      <div
        ref={articlesRef}
        style={{ height: articlesHeight }}
        className={`${ARTICLES_ID} ${getClassOverride(ARTICLES_ID, configuration.classes)}`}
      >
        <div className="magic-search-title">
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
      {!shouldShowMore && articles.length > 0 && (
        <button onClick={() => setShouldShowMore(true)}>
          {configuration?.copy?.showMoreButton || "SEE MORE RESULTS"}
        </button>
      )}
      <div
        className={`${CHAT_ID} ${getClassOverride(CHAT_ID, configuration.classes)}`}
      >
        {chatResponse.length > 0 ? (
          chatResponse
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
          setLastSearchValue(searchTerm);
        }}
        inputWrapClassNames="magic-search-chat-input-wrap"
        innerRef={searchInputRef}
      />
    </>
  );
};

export default Results;
