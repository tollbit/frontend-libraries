import { getClassOverride, twMerge } from "../utils";
import SearchBar from "../components/SearchBar";
import {
  INTRO_TITLE_ID,
  PROMPT_ID,
  SUGGESTIONS_ID,
  SUGGESTIONS_TITLE_ID,
} from "../utils/constants";
import { useConfiguration } from "../context/ConfigurationProvider";
import PlaceholderPrompt from "../components/PlaceholderPrompt";
import { useTracker } from "../context/TrackerProvider";

const Home = ({
  shouldShow,
  prompts,
  searchInputRef,
  searchTerm,
  setSearchTerm,
  submitSearch,
  isStreamActive,
  setStopStream,
}: {
  prompts: string[] | null;
  shouldShow: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  submitSearch: (_value: string) => void;
  isStreamActive: boolean;
  setStopStream: (_: boolean) => void;
}) => {
  const tracker = useTracker();
  const configuration = useConfiguration();
  return (
    <div className={shouldShow ? "tb-block" : "tb-hidden"}>
      <div
        className={twMerge(
          `tb-bg-white tb-text-lg tb-py-3 tb-px-10 ${getClassOverride(INTRO_TITLE_ID, configuration)}`,
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
          if (!isStreamActive && searchTerm.length > 0) {
            submitSearch(searchTerm);
          }
        }}
        isStreamActive={isStreamActive}
        innerRef={searchInputRef}
        stopStream={(stop: boolean) => setStopStream(stop)}
      />
      <div
        className={`tb-h-full tb-px-5 tb-py-0 tb-mb-3 ${getClassOverride(SUGGESTIONS_ID, configuration)}`}
      >
        <h3
          className={twMerge(
            `tb-text-md tb-font-bold tb-px-5 tb-py-0 tb-mb-3 ${getClassOverride(SUGGESTIONS_TITLE_ID, configuration)}`,
          )}
        >
          {configuration?.copy?.suggestionsTitle || "THINGS YOU SHOULD KNOW"}
        </h3>
        {prompts && prompts.length > 0 ? (
          prompts.map((prompt: any) => (
            <button
              className={twMerge(
                `tb-py-4 tb-px-5 tb-bg-white tb-rounded-3xl tb-text-left tb-mb-3 ${getClassOverride(PROMPT_ID, configuration)}`,
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
