import React from "react";
import { useClassOverride } from "../utils";
import SearchBar from "../components/SearchBar";
import {
  INTRO_TITLE_ID,
  PROMPT_ID,
  SUGGESTIONS_ID,
  SUGGESTIONS_TITLE_ID,
} from "../utils/constants";
import { useConfiguration } from "../context/ConfigurationProvider";
import { twMerge } from "tailwind-merge";

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
  submitSearch: (value: string) => void;
}) => {
  const configuration = useConfiguration();
  return (
    <div className={shouldShow ? "block" : "hidden"}>
      <div
        className={twMerge(
          `bg-white text-lg py-3 px-10 ${useClassOverride(INTRO_TITLE_ID)}`,
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
      {prompts.length > 0 && (
        <div
          className={`h-full px-6 py-0 mb-3 ${useClassOverride(SUGGESTIONS_ID)}`}
        >
          <h3
            className={twMerge(
              `text-md font-bold px-6 py-0 mb-3 ${useClassOverride(SUGGESTIONS_TITLE_ID)}`,
            )}
          >
            {configuration?.copy?.suggestionsTitle || "THINGS YOU SHOULD KNOW"}
          </h3>
          {prompts.map((prompt: any) => (
            <button
              className={twMerge(
                `p-4 bg-white rounded-3xl mb-3 ${useClassOverride(PROMPT_ID)}`,
              )}
              key={prompt.question}
              onClick={() => submitSearch(prompt.question)}
            >
              {prompt.question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
