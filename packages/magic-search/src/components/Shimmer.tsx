import { twMerge } from "tailwind-merge";

const Shimmer = ({
  width,
  classNames,
}: {
  width: number;
  classNames?: string;
}) => (
  <div
    className={twMerge(
      "h-4 rounded-xl animate-pulse bg-[rgba(226,226,226,1)] bg-[linear-gradient(90deg,rgba(226,226,226,1)_9%,_rgba(238,238,238,1)_18%,_rgba(226,226,226,1)_31%)] [background-size:1300px_100%]",
      classNames,
    )}
    style={{ width: `${width}px` }}
  />
);

export default Shimmer;
