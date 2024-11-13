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
      aria-label={`Navigate ${direction}`}
      className={twMerge(
        `tb-h-14 tb-w-14 tb-m-1 tb-border-px tb-border-solid tb-border-[#595959] tb-rounded-md tb-shadow-md tb-bg-white tb-flex tb-items-center ${disabled ? "tb-bg-[#EAEAEA]" : ""} ${getClassOverride(NAV_BUTTON_ID, configuration)}`,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {direction === "backward" ? (
        <svg
          className="tb-mx-auto tb-my-0 tb-stroke-[#595959]"
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
