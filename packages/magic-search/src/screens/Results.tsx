import { useEffect, useRef, useState } from "react";
import { useClassOverride } from "../utils";
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

  throw new Error("results error");
  return (
    <div className={shouldShow ? "block" : "hidden"}>
      <div
        className={twMerge(
          `text-2xl bg-white pt-0 px-6 pb-6 ${useClassOverride(LAST_SEARCH_ID)}`,
        )}
      >
        {lastSearchValue}
      </div>
      <div
        ref={articlesRef}
        style={{ height: articlesHeight }}
        className={twMerge(
          `flex flex-col overflow-hidden gap-2 bg-white px-6 py-0 [transition:height_.5s_ease-in] ${useClassOverride(ARTICLES_ID)}`,
        )}
      >
        <div
          className={twMerge(
            `text-base font-bold ${useClassOverride(ARTICLES_TITLE_ID)}`,
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
            `bg-[linear-gradient(0,_transparent_50%,_white_50%)] ${useClassOverride(SEE_MORE_BUTTON_BACKGROUND_ID)}`,
          )}
        >
          <button
            onClick={() => setShouldShowMore(true)}
            className={twMerge(
              `rounded-xl w-full text-center bg-white p-3 shadow-md m-2 ${useClassOverride(SEE_MORE_BUTTON_ID)}`,
            )}
          >
            {configuration?.copy?.showMoreButton || "SEE MORE RESULTS"}
          </button>
        </div>
      )}
      <div
        className={twMerge(
          `px-6 py-3 mb-10 min-h-screen ${useClassOverride(CHAT_ID)}`,
        )}
      >
        {chatResponse?.length > 0 ? (
          // @TODO Can we do anything better here for streaming the response with embedded links? Maybe a markdown renderer
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: chatResponse }}
          />
        ) : (
          <>
            <Shimmer width={180} />
            <Shimmer width={240} />
            <Shimmer width={320} />
            <Shimmer width={380} />
          </>
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
        inputWrapClassNames="sticky bottom-6 left-0"
        innerRef={searchInputRef}
      />
    </div>
  );
};

export default Results;
