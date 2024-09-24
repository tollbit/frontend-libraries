import { useConfiguration } from "../context/ConfigurationProvider";
import { getClassOverride } from "../utils";
import { PROMPT_ID } from "../utils/constants";
import Shimmer from "./Shimmer";
import { twMerge } from "tailwind-merge";

const PlaceholderPrompt = () => {
  const configuration = useConfiguration();
  return (
    <div
      className={twMerge(
        `py-4 px-6 bg-white rounded-3xl mb-3 ${getClassOverride(PROMPT_ID, configuration)}`,
      )}
    >
      <Shimmer width={300} />
      <Shimmer width={350} classNames="mb-0" />
    </div>
  );
};

export default PlaceholderPrompt;
