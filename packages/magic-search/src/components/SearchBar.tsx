import { getClassOverride, twMerge } from "../utils";
import {
  SEARCH_BACKGROUND_ID,
  SEARCH_INPUT_CONTAINER_ID,
  SEARCH_INPUT_ID,
  SEARCH_INPUT_WRAP_ID,
} from "../utils/constants";
import { useConfiguration } from "../context/ConfigurationProvider";
import StopIcon from "../icons/StopIcon";

const SearchBar = ({
  innerRef,
  handleSubmit,
  isStreamActive,
  stopStream,
  value,
  inputClassNames = "",
  inputWrapClassNames = "",
  handleChange,
}: {
  innerRef: React.RefObject<HTMLInputElement>;
  isStreamActive: boolean;
  stopStream?: (_: boolean) => void;
  value: string;
  inputClassNames?: string;
  inputWrapClassNames?: string;
  handleSubmit: (_e: React.FormEvent) => void;
  handleChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const configuration = useConfiguration();
  return (
    <div
      className={twMerge(
        `tb-px-5 tb-py-0 tb-bg-[linear-gradient(0,_transparent_50%,_white_50%)] ${inputWrapClassNames} ${getClassOverride(SEARCH_BACKGROUND_ID, configuration)}`,
      )}
    >
      <div
        className={twMerge(
          `tb-bg-[linear-gradient(to_right,_red,_purple)] tb-p-1 tb-rounded-[40px] tb-mb-6 ${getClassOverride(SEARCH_INPUT_WRAP_ID, configuration)}`,
        )}
      >
        <div
          className={twMerge(
            `tb-flex tb-justify-between tb-items-center tb-rounded-[40px] tb-px-2 tb-py-3 tb-bg-white has-[:disabled]:bg-indigo-500 ${inputClassNames} ${getClassOverride(SEARCH_INPUT_CONTAINER_ID, configuration)}`,
          )}
        >
          <form onSubmit={handleSubmit} className="tb-w-full">
            <input
              role="search"
              ref={innerRef}
              value={value}
              onChange={handleChange}
              className={twMerge(
                `tb-w-full tb-h-10 tb-p-2 focus:tb-outline-none  ${inputClassNames} ${getClassOverride(SEARCH_INPUT_ID, configuration)}`,
              )}
              placeholder={
                configuration?.copy?.searchPlaceholder ||
                "Search for anything..."
              }
            />
          </form>
          {stopStream && isStreamActive && (
            <button
              aria-label="Stop summary response"
              onClick={() => stopStream(true)}
            >
              <StopIcon height={40} width={40} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
