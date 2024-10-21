import { getClassOverride, twMerge } from "../utils";
import { NAV_BUTTON_ID } from "../utils/constants";
import { useConfiguration } from "../context/ConfigurationProvider";

const NavButton = ({
  direction = "forward",
  disabled = false,
  onClick = () => {},
}: {
  direction: "forward" | "backward";
  disabled: boolean;
  onClick?: () => void;
}) => {
  const configuration = useConfiguration();
  return (
    <button
      className={twMerge(
        `h-14 w-14 m-1 border-px border-solid border-[#595959] rounded-md shadow-md bg-white flex items-center ${disabled ? "bg-[#EAEAEA]" : ""} ${getClassOverride(NAV_BUTTON_ID, configuration)}`,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {direction === "backward" ? (
        <svg
          className="mx-auto my-0 stroke-[#595959]"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      ) : (
        <svg
          className="mx-auto my-0 stroke-[#595959]"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="rotate(180)"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      )}
    </button>
  );
};

export default NavButton;
