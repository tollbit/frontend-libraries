import React from "react";

const NavButton = ({
  direction = "forward",
  disabled = false,
  onClick = () => {},
}: {
  direction: "forward" | "backward";
  disabled: boolean;
  onClick?: () => void;
}) => (
  <button
    className={`magic-search-nav-button ${disabled ? "magic-search-nav-button-disabled" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {direction === "backward" ? (
      <svg
        className="magic-search-nav-button-icon"
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
        className="magic-search-nav-button-icon"
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

export default NavButton;
