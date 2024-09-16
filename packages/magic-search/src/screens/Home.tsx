import React, { useState, useEffect } from "react";
import { getClassOverride } from "../utils";
import Prompt from "../components/Prompt";
import SearchBar from "../components/SearchBar";
import { SEARCH_INPUT_ID, SUGGESTIONS_ID } from "../utils/constants";
import { MagicSearchConfiguration } from "../utils/types";

const Home = ({
  shouldShow,
  prompts,
  searchInputRef,
  configuration,
  searchTerm,
  setSearchTerm,
  submitSearch,
}: {
  prompts: any[];
  shouldShow: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
  configuration: MagicSearchConfiguration;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  submitSearch: (value: string) => void;
}) => (
  <div
    className={`magic-search-home ${shouldShow ? "magic-search-page-show" : "magic-search-page-hide"}`}
  >
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
        submitSearch(searchTerm);
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
            submitSearch={() => submitSearch(prompt.question)}
            question={prompt.question}
          />
        ))}
      </div>
    )}
  </div>
);

export default Home;
