import { Gradient, GradientColor } from "../utils/types";
interface TabIconProps {
  direction: "left" | "right";
  gradient?: Gradient;
}

const defaultGradient = {
  gradientColors: [
    {
      offset: "0%",
      stopColor: "#8d57d9",
    },
    {
      offset: "100%",
      stopColor: "#f4567b",
    },
  ],
};

const TabIcon = ({ direction, gradient = defaultGradient }: TabIconProps) => (
  <svg
    height="100vh"
    viewBox="0 0 33 820"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transform={direction === "right" ? "scale(-1, 1)" : ""}
  >
    <defs>
      <linearGradient
        id="bgGradient"
        x1={gradient.x1 || "0%"}
        y1={gradient.y1 || "0%"}
        x2={gradient.x2 || "0%"}
        y2={gradient.y2 || "100%"}
        gradientUnits="userSpaceOnUse"
      >
        {gradient.gradientColors.map((color: GradientColor) => (
          <stop
            key={color.stopColor}
            offset={color.offset}
            stopColor={color.stopColor}
          />
        ))}
      </linearGradient>
    </defs>
    <rect
      width="6"
      height="820"
      transform="matrix(-1 0 0 1 6.69531 0)"
      fill="url(#bgGradient)"
    />
    <path
      d="M11.3561 315.187L29.3075 308.298C31.0471 307.631 32.1953 305.96 32.1953 304.097V190.977C32.1953 189.137 31.0746 187.482 29.3656 186.799L11.7074 179.74C8.66822 178.525 6.62419 175.666 6.43232 172.429H4.19531V321.872H6.4337C6.62696 318.89 8.53775 316.269 11.3561 315.187Z"
      fill="url(#bgGradient)"
    />
    <path
      d="M17.1669 208.3334C20.8488 208.3334 23.8336 205.3486 23.8336 201.6667 23.8336 197.9848 20.8488 195 17.1669 195 13.485 195 10.5002 197.9848 10.5002 201.6667 10.5002 205.3486 13.485 208.3334 17.1669 208.3334Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.5003 210 21.917 206.4167"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.8449 209.8333V212.1667M9.0116 211H6.6782"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 17.1669 201.6667; 10 17.1669 201.6667; -5 17.1669 201.6667; 0 17.1669 201.6667"
        keyTimes="0; 0.25; 0.75; 1"
        dur="1s"
        keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
        calcMode="spline"
        repeatCount="1"
      />
    </path>
    <path
      d="M24.7334 192.6412H27.6895"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 17.1669 201.6667; 10 17.1669 201.6667; -10 17.1669 201.6667; 0 17.1669 201.6667"
        keyTimes="0; 0.25; 0.75; 1"
        dur="1s"
        keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
        calcMode="spline"
        repeatCount="1"
      />
    </path>
    <path
      d="M26.1919 191.1536V194.1289"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 17.1669 201.6667; 10 17.1669 201.6667; -10 17.1669 201.6667; 0 17.1669 201.6667"
        keyTimes="0; 0.25; 0.75; 1"
        dur="1s"
        keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
        calcMode="spline"
        repeatCount="1"
      />
    </path>
  </svg>
);

export default TabIcon;
