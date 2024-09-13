import React, { useState, useEffect } from "react";
import { getClassOverride } from "../utils";
import Prompt from "../components/Prompt";
import SearchBar from "../components/SearchBar";
import { SEARCH_INPUT_ID, SUGGESTIONS_ID } from "../utils/constants";
import { MagicSearchConfiguration } from "../utils/types";

const Home = ({
  publicKey,
  prompts,
  searchInputRef,
  configuration,
  searchTerm,
  setSearchTerm,
  setLastSearchValue,
}: {
  prompts: any[];
  publicKey: string;
  searchInputRef: React.RefObject<HTMLInputElement>;
  configuration: MagicSearchConfiguration;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setLastSearchValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [promptAnswers, setPromptAnswers] = useState<object>({});

  return (
    <>
      <div className="magic-search-intro-title">
        {configuration?.copy?.introTitle ||
          "I can help you find what you're looking for"}
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
        innerRef={searchInputRef}
      />
      {prompts.length > 0 && (
        <div
          className={`magic-search-prompts ${getClassOverride(SUGGESTIONS_ID, configuration.classes)}`}
        >
          <h3 className="magic-search-suggestions-title magic-search-title">
            {configuration?.copy?.suggestionsTitle || "THINGS YOU SHOULD KNOW"}
          </h3>
          {prompts.map((prompt: any) => (
            <Prompt
              key={prompt.question}
              setLastSearchValue={setLastSearchValue}
              question={prompt.question}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Home;
