import { useClassOverride } from "../utils";
import { PROMPT_ID } from "../utils/constants";
import Shimmer from "./Shimmer";
import { twMerge } from "tailwind-merge";

const PlaceholderPrompt = () => {
  return (
    <div
      className={twMerge(
        `p-4 bg-white rounded-3xl mb-3 ${useClassOverride(PROMPT_ID)}`,
      )}
    >
      <Shimmer width={300} />
      <Shimmer width={250} />
      <Shimmer width={350} />
    </div>
  );
};

export default PlaceholderPrompt;
