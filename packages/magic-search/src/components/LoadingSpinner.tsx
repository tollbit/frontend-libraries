import { LOADING_SPINNER_DOT_ID, LOADING_SPINNER_ID } from "../utils/constants";
import { getClassOverride, twMerge } from "../utils";
import { useConfiguration } from "../context/ConfigurationProvider";

const LoadingSpinner = () => {
  const configuration = useConfiguration();
  return (
    <div
      className={`tb-flex tb-h-full tb-space-x-2 tb-justify-center tb-items-center ${getClassOverride(LOADING_SPINNER_ID, configuration)}`}
    >
      <span className="tb-sr-only">Loading...</span>
      <div
        className={twMerge(
          `tb-h-4 tb-w-4 tb-bg-gray-800 tb-rounded-full tb-animate-bounce [animation-delay:-0.3s] ${getClassOverride(LOADING_SPINNER_DOT_ID, configuration)}`,
        )}
      />
      <div
        className={twMerge(
          `tb-h-4 tb-w-4 tb-bg-gray-800 tb-rounded-full tb-animate-bounce [animation-delay:-0.15s] ${getClassOverride(LOADING_SPINNER_DOT_ID, configuration)}`,
        )}
      />
      <div
        className={twMerge(
          `tb-h-4 tb-w-4 tb-bg-gray-800 tb-rounded-full tb-animate-bounce ${getClassOverride(LOADING_SPINNER_DOT_ID, configuration)}`,
        )}
      />
    </div>
  );
};
export default LoadingSpinner;
