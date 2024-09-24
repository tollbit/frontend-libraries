import { getClassOverride } from "../utils";
import SearchBar from "../components/SearchBar";
import {
  INTRO_TITLE_ID,
  PROMPT_ID,
  SUGGESTIONS_ID,
  SUGGESTIONS_TITLE_ID,
} from "../utils/constants";
import { useConfiguration } from "../context/ConfigurationProvider";
import { twMerge } from "tailwind-merge";
import PlaceholderPrompt from "../components/PlaceholderPrompt";
import { useTracker } from "../context/TrackerProvider";

const Home = ({
  shouldShow,
  prompts,
  searchInputRef,
  searchTerm,
  setSearchTerm,
  submitSearch,
}: {
  prompts: any[];
  shouldShow: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  submitSearch: (_value: string) => void;
}) => {
  const tracker = useTracker();
  const configuration = useConfiguration();
  return (
    <div className={shouldShow ? "block" : "hidden"}>
      <div
        className={twMerge(
          `bg-white text-lg py-3 px-10 ${getClassOverride(INTRO_TITLE_ID, configuration)}`,
        )}
      >
        {configuration?.copy?.introTitle ||
          "I can help you find what you're looking for"}
      </div>
      <SearchBar
        value={searchTerm}
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        handleSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          submitSearch(searchTerm);
        }}
        innerRef={searchInputRef}
      />
      <div
        className={`h-full px-5 py-0 mb-3 ${getClassOverride(SUGGESTIONS_ID, configuration)}`}
      >
        <h3
          className={twMerge(
            `text-md font-bold px-5 py-0 mb-3 ${getClassOverride(SUGGESTIONS_TITLE_ID, configuration)}`,
          )}
        >
          {configuration?.copy?.suggestionsTitle || "THINGS YOU SHOULD KNOW"}
        </h3>
        {prompts.length > 0 ? (
          prompts.map((prompt: any) => (
            <button
              className={twMerge(
                `py-4 px-5 bg-white rounded-3xl text-left mb-3 ${getClassOverride(PROMPT_ID, configuration)}`,
              )}
              key={prompt.question}
              onClick={() => {
                tracker.trackEvent("prompt_clicked", {
                  question: prompt.question,
                });
                submitSearch(prompt.question);
              }}
            >
              {prompt.question}
            </button>
          ))
        ) : (
          <>
            <PlaceholderPrompt />
            <PlaceholderPrompt />
            <PlaceholderPrompt />
            <PlaceholderPrompt />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
