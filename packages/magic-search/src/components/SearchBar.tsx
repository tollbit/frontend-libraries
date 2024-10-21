import { getClassOverride, twMerge } from "../utils";
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
  handleSubmit: (_e: React.FormEvent) => void;
  handleChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const configuration = useConfiguration();
  return (
    <div
      className={twMerge(
        `px-5 py-0 bg-[linear-gradient(0,_transparent_50%,_white_50%)] ${inputWrapClassNames} ${getClassOverride(SEARCH_BACKGROUND_ID, configuration)}`,
      )}
    >
      <div
        className={twMerge(
          `bg-[linear-gradient(to_right,_red,_purple)] p-1 rounded-[40px] mb-6 ${getClassOverride(SEARCH_INPUT_WRAP_ID, configuration)}`,
        )}
      >
        <div
          className={twMerge(
            `flex justify-between items-center rounded-[40px] px-2 py-3 bg-white ${inputClassNames} ${getClassOverride(SEARCH_INPUT_CONTAINER_ID, configuration)}`,
          )}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <input
              ref={innerRef}
              value={value}
              onChange={handleChange}
              className={twMerge(
                `w-full h-10 p-2 focus:outline-none  ${inputClassNames} ${getClassOverride(SEARCH_INPUT_ID, configuration)}`,
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
