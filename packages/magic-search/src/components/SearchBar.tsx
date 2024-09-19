import React from "react";
import { useClassOverride } from "../utils";
import {
  SEARCH_BACKGROUND_ID,
  SEARCH_INPUT_CONTAINER_ID,
  SEARCH_INPUT_ID,
  SEARCH_INPUT_WRAP_ID,
} from "../utils/constants";
import { useConfiguration } from "../context/ConfigurationProvider";
import { twMerge } from "tailwind-merge";

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
      className={twMerge(
        `px-4 py-0 bg-[linear-gradient(0,_transparent_50%,_white_50%)] ${useClassOverride(SEARCH_BACKGROUND_ID)} ${inputWrapClassNames}`,
      )}
    >
      <div
        className={twMerge(
          `bg-[linear-gradient(to_right,_red,_purple)] p-1 rounded-[40px] mb-6 ${useClassOverride(SEARCH_INPUT_WRAP_ID)}`,
        )}
      >
        <div
          className={twMerge(
            `flex justify-between items-center rounded-[40px] p-3 bg-white ${useClassOverride(SEARCH_INPUT_CONTAINER_ID)} ${inputClassNames}`,
          )}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <input
              ref={innerRef}
              value={value}
              onChange={handleChange}
              className={twMerge(
                `w-full h-10 p-1 focus:outline-none ${useClassOverride(SEARCH_INPUT_ID)} ${inputClassNames}`,
              )}
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
