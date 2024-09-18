import React from "react";
import { getClassOverride } from "../utils";
import SearchBar from "../components/SearchBar";
import {
  INTRO_TITLE_ID,
  PROMPT_ID,
  SUGGESTIONS_ID,
  SUGGESTIONS_TITLE_ID,
} from "../utils/constants";
import { useConfiguration } from "../context/ConfigurationProvider";

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
    <div
      className={`magic-search-home ${shouldShow ? "magic-search-page-show" : "magic-search-page-hide"}`}
    >
      <div
        className={`${INTRO_TITLE_ID} ${getClassOverride(INTRO_TITLE_ID, configuration.classes)} `}
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
          className={`${SUGGESTIONS_ID} ${getClassOverride(SUGGESTIONS_ID, configuration.classes)}`}
        >
          <h3
            className={`${SUGGESTIONS_TITLE_ID} ${getClassOverride(SUGGESTIONS_TITLE_ID, configuration.classes)}`}
          >
            {configuration?.copy?.suggestionsTitle || "THINGS YOU SHOULD KNOW"}
          </h3>
          {prompts.map((prompt: any) => (
            <button
              className={`${PROMPT_ID} ${getClassOverride(PROMPT_ID, configuration.classes)}`}
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
