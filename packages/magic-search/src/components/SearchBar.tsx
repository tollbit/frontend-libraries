import React from "react";
import { getClassOverride } from "../utils";
import {
  SEARCH_BACKGROUND_ID,
  SEARCH_INPUT_CONTAINER_ID,
  SEARCH_INPUT_ID,
  SEARCH_INPUT_WRAP_ID,
} from "../utils/constants";
import { useConfiguration } from "../context/ConfigurationProvider";

const SearchBar = ({
  innerRef,
  handleSubmit,
  value,
  inputClassNames = "",
  inputWrapClassNames = "",
  handleChange,
}: {
  innerRef: React.RefObject<HTMLInputElement>;
  value: string;
  inputClassNames?: string;
  inputWrapClassNames?: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const configuration = useConfiguration();
  return (
    <div
      className={`${SEARCH_BACKGROUND_ID} ${getClassOverride(SEARCH_BACKGROUND_ID, configuration.classes)} ${inputWrapClassNames}`}
    >
      <div
        className={`${SEARCH_INPUT_WRAP_ID} ${getClassOverride(SEARCH_INPUT_WRAP_ID, configuration.classes)}`}
      >
        <div
          className={`${SEARCH_INPUT_CONTAINER_ID} ${getClassOverride(SEARCH_INPUT_CONTAINER_ID, configuration.classes)} ${inputClassNames}`}
        >
          <form onSubmit={handleSubmit} className="magic-search-form">
            <input
              ref={innerRef}
              value={value}
              onChange={handleChange}
              className={`${SEARCH_INPUT_ID} ${getClassOverride(SEARCH_INPUT_ID, configuration.classes)} ${inputClassNames}`}
              placeholder={
                configuration?.copy?.searchPlaceholder ||
                "Search for anything..."
              }
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
