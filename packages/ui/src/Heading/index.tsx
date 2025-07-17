import { cn } from "../utils";

const SIZES = {
  //@TODO: Add back text xl to 7xl
  "7xl": "heading-7xl",
  "6xl": "heading-6xl",
  "5xl": "heading-5xl",
  "4xl": "heading-4xl",
  "3xl": "heading-3xl",
  "2xl": "heading-2xl",
  xl: "heading-xl",
  lg: "heading-lg",
  md: "heading-md",
  sm: "heading-sm",
  xs: "heading-xs",
};

const HEADING = {
  h1: "heading-xl",
  h2: "heading-lg",
  h3: "heading-md",
  h4: "heading-sm",
  h5: "heading-xs",
  h6: "text-base",
};

type HeadingOption = keyof typeof HEADING;
type SizeOption = keyof typeof SIZES;

export default function Heading({
  children,
  is = "h1",
  className,
  size,
}: {
  children: React.ReactNode;
  is?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  size?: SizeOption;
}) {
  const Element = is;
  const classSize =
    typeof Element === "string" && Object.keys(HEADING).includes(Element)
      ? HEADING[Element as HeadingOption]
      : null;

  return (
    <Element
      className={cn(
        size ? SIZES[size] : classSize,
        `font-bold text-pretty`,
        className,
      )}
    >
      {children}
    </Element>
  );
}

export function Subheading({
  children,
  is = "h6",
  classNames,
  size,
}: {
  size?: SizeOption;
  children: React.ReactNode;
  is?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  classNames?: string;
}) {
  const Element = is;
  const classSize =
    typeof Element === "string" && Object.keys(HEADING).includes(Element)
      ? HEADING[Element as HeadingOption]
      : null;

  return (
    <Element
      className={cn(
        size ? SIZES[size] : classSize,
        `font-normal leading-7 text-pretty`,
        classNames,
      )}
    >
      {children}
    </Element>
  );
}
