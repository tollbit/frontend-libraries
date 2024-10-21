import { useConfiguration } from "../context/ConfigurationProvider";
import { getClassOverride, twMerge } from "../utils";
import { PROMPT_ID } from "../utils/constants";
import Shimmer from "./Shimmer";

const PlaceholderPrompt = () => {
  const configuration = useConfiguration();
  return (
    <div
      className={twMerge(
        `tb-py-4 tb-px-5 tb-flex tb-flex-col tb-gap-2 tb-bg-white tb-rounded-3xl tb-mb-3 ${getClassOverride(PROMPT_ID, configuration)}`,
      )}
    >
      <Shimmer width={300} />
      <Shimmer width={350} />
    </div>
  );
};

export default PlaceholderPrompt;
