import { useEffect, useRef, useState } from "react";
import { getClassOverride } from "../utils";
import {
  ARTICLES_ID,
  ARTICLES_TITLE_ID,
  CHAT_ID,
  LAST_SEARCH_ID,
  SEE_MORE_BUTTON_BACKGROUND_ID,
  SEE_MORE_BUTTON_ID,
} from "../utils/constants";
import Article from "../components/Article";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useConfiguration } from "../context/ConfigurationProvider";
import { twMerge } from "tailwind-merge";
import Shimmer from "../components/Shimmer";
import { useTracker } from "../context/TrackerProvider";

const Results = ({
  shouldShow,
  chatResponse,
  articles,
  searchTerm,
  setSearchTerm,
  submitSearch,
  searchInputRef,
  lastSearchValue,
}: {
  shouldShow: boolean;
  chatResponse: string;
  articles: any[];
  lastSearchValue: string;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  submitSearch: (_value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}) => {
  const tracker = useTracker();
  const configuration = useConfiguration();
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
    <div className={shouldShow ? "block" : "hidden"}>
      <div
        className={twMerge(
          `text-2xl bg-white pt-0 px-10 pb-6 ${getClassOverride(LAST_SEARCH_ID, configuration)}`,
        )}
      >
        {lastSearchValue}
      </div>
      <div
        ref={articlesRef}
        style={{ height: articlesHeight }}
        className={twMerge(
          `flex flex-col overflow-hidden gap-4 bg-white px-10 py-0 [transition:height_.5s_ease-in] ${getClassOverride(ARTICLES_ID, configuration)}`,
        )}
      >
        <div
          className={twMerge(
            `text-base font-bold ${getClassOverride(ARTICLES_TITLE_ID, configuration)}`,
          )}
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
          className={twMerge(
            `bg-[linear-gradient(0,_transparent_50%,_white_50%)] ${getClassOverride(SEE_MORE_BUTTON_BACKGROUND_ID, configuration)}`,
          )}
        >
          <button
            onClick={() => {
              tracker.trackEvent("see_more_results", {
                searchTerm: lastSearchValue,
              });
              setShouldShowMore(true);
            }}
            className={twMerge(
              `rounded-xl w-[calc(100%-3rem)] text-center bg-white p-3 shadow-md mx-6 my-1 ${getClassOverride(SEE_MORE_BUTTON_ID, configuration)}`,
            )}
          >
            {configuration?.copy?.showMoreButton || "SEE MORE RESULTS"}
          </button>
        </div>
      )}
      <div
        className={twMerge(
          `px-10 py-4 mb-10 min-h-screen ${getClassOverride(CHAT_ID, configuration)}`,
        )}
      >
        {chatResponse?.length > 0 ? (
          // @TODO Can we do anything better here for streaming the response with embedded links? Maybe a markdown renderer
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: chatResponse }}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <Shimmer width={180} />
            <Shimmer width={240} />
            <Shimmer width={320} />
            <Shimmer width={380} />
          </div>
        )}
      </div>
      <SearchBar
        value={searchTerm}
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        handleSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (searchTerm.length > 0) {
            submitSearch(searchTerm);
          }
        }}
        inputWrapClassNames="sticky bottom-6 left-0 bg-none"
        innerRef={searchInputRef}
      />
    </div>
  );
};

export default Results;
