import React from "react";
import { LOADING_SPINNER_DOT_ID, LOADING_SPINNER_ID } from "../utils/constants";
import { useClassOverride } from "../utils";
import { twMerge } from "tailwind-merge";

const LoadingSpinner = () => {
  return (
    <div
      className={`flex h-full space-x-2 justify-center items-center ${useClassOverride(LOADING_SPINNER_ID)}`}
    >
      <span className="sr-only">Loading...</span>
      <div
        className={twMerge(
          `h-4 w-4 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.3s] ${useClassOverride(LOADING_SPINNER_DOT_ID)}`,
        )}
      />
      <div
        className={twMerge(
          `h-4 w-4 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.15s] ${useClassOverride(LOADING_SPINNER_DOT_ID)}`,
        )}
      />
      <div
        className={twMerge(
          `h-4 w-4 bg-gray-800 rounded-full animate-bounce ${useClassOverride(LOADING_SPINNER_DOT_ID)}`,
        )}
      />
    </div>
  );
};
export default LoadingSpinner;
