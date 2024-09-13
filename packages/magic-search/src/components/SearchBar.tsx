import React from "react";
import { getClassOverride } from "../utils";
import { SEARCH_INPUT_ID, SEARCH_INPUT_WRAP_ID } from "../utils/constants";
import { MagicSearchConfiguration } from "../utils/types";

const SearchBar = ({
  innerRef,
  handleSubmit,
  value,
  inputClassNames = "",
  inputWrapClassNames = "",
  handleChange,
  configuration,
}: {
  innerRef: React.RefObject<HTMLInputElement>;
  value: string;
  inputClassNames?: string;
  inputWrapClassNames?: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  configuration: MagicSearchConfiguration;
}) => {
  return (
    <div
      className={`${SEARCH_INPUT_WRAP_ID} ${getClassOverride(SEARCH_INPUT_WRAP_ID, configuration.classes)} ${inputWrapClassNames}`}
    >
      <div className="magic-search-input-container">
        <form onSubmit={handleSubmit} className="magic-search-form">
          <input
            ref={innerRef}
            value={value}
            onChange={handleChange}
            className={`${SEARCH_INPUT_ID} ${getClassOverride(SEARCH_INPUT_ID, configuration.classes)} ${inputClassNames}`}
            placeholder={
              configuration?.copy?.searchPlaceholder || "Search for anything..."
            }
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
