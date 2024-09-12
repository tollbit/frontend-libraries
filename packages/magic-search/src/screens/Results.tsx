import React from "react";
import { getClassOverride } from "../utils";
import { ARTICLES_ID, CHAT_ID, SEARCH_INPUT_ID } from "../utils/constants";
import { MagicSearchConfiguration } from "../utils/types";
import Article from "../components/Article";
import SearchBar from "../components/SearchBar";
const Results = ({
  articles,
  searchTerm,
  setSearchTerm,
  setIsSubmitting,
  searchInputRef,
  lastSearchValue,
  configuration,
}: {
  articles: any[];
  lastSearchValue: string;
  configuration: MagicSearchConfiguration;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  searchInputRef: React.RefObject<HTMLInputElement>;
}) => {
  return (
    <>
      {articles.length > 0 && (
        <div className="magic-search-last-search">{lastSearchValue}</div>
      )}

      {articles.length > 0 && (
        <div
          className={`${ARTICLES_ID} ${getClassOverride(ARTICLES_ID, configuration.classes)}`}
        >
          <div className="magic-search-title">
            {configuration?.copy?.searchResultsTitle || "TOP RESULTS"}
          </div>
          {articles.map((article: any) => (
            <Article key={article.title} {...article} />
          ))}
        </div>
      )}
      <div
        className={`${CHAT_ID} ${getClassOverride(CHAT_ID, configuration.classes)}`}
      ></div>
      <SearchBar
        placeholder={
          configuration?.copy?.searchPlaceholder || "Search for anything..."
        }
        value={searchTerm}
        classNames={`${SEARCH_INPUT_ID} ${getClassOverride(SEARCH_INPUT_ID, configuration.classes)}`}
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        handleSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);
        }}
        innerRef={searchInputRef}
      />
    </>
  );
};

export default Results;
