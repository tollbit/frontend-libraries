import React from "react";
import { getClassOverride } from "../utils";
import Prompt from "../components/Prompt";
import SearchBar from "../components/SearchBar";
import { SEARCH_INPUT_ID, SUGGESTIONS_ID } from "../utils/constants";
import { MagicSearchConfiguration } from "../utils/types";

const Home = ({
  prompts,
  searchInputRef,
  configuration,
  searchTerm,
  setSearchTerm,
  setIsSubmitting,
}: {
  prompts: any[];
  searchInputRef: React.RefObject<HTMLInputElement>;
  configuration: MagicSearchConfiguration;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="magic-search-intro-title">
        {configuration?.copy?.introTitle ||
          "I can help you find what you're looking for"}
      </div>
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
      {prompts.length > 0 && (
        <div
          className={`magic-search-suggestions ${getClassOverride(SUGGESTIONS_ID, configuration.classes)}`}
        >
          <h3 className="magic-search-suggestions-title magic-search-title">
            {configuration?.copy?.suggestionsTitle || "THINGS YOU SHOULD KNOW"}
          </h3>
          {prompts.map((prompt: any) => (
            <Prompt
              key={prompt.id}
              question={prompt.question}
              submitPrompt={() => {
                setSearchTerm(prompt.question);
                setIsSubmitting(true);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Home;
