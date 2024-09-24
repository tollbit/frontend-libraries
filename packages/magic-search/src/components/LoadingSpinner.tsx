import { LOADING_SPINNER_DOT_ID, LOADING_SPINNER_ID } from "../utils/constants";
import { getClassOverride } from "../utils";
import { twMerge } from "tailwind-merge";
import { useConfiguration } from "../context/ConfigurationProvider";

const LoadingSpinner = () => {
  const configuration = useConfiguration();
  return (
    <div
      className={`flex h-full space-x-2 justify-center items-center ${getClassOverride(LOADING_SPINNER_ID, configuration)}`}
    >
      <span className="sr-only">Loading...</span>
      <div
        className={twMerge(
          `h-4 w-4 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.3s] ${getClassOverride(LOADING_SPINNER_DOT_ID, configuration)}`,
        )}
      />
      <div
        className={twMerge(
          `h-4 w-4 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.15s] ${getClassOverride(LOADING_SPINNER_DOT_ID, configuration)}`,
        )}
      />
      <div
        className={twMerge(
          `h-4 w-4 bg-gray-800 rounded-full animate-bounce ${getClassOverride(LOADING_SPINNER_DOT_ID, configuration)}`,
        )}
      />
    </div>
  );
};
export default LoadingSpinner;
