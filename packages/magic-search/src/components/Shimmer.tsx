import { twMerge } from "../utils";

const Shimmer = ({
  width,
  classNames,
}: {
  width: number;
  classNames?: string;
}) => (
  <div
    className={twMerge(
      "tb-h-4 tb-rounded-xl tb-animate-pulse tb-bg-[rgba(226,226,226,1)] tb-bg-[linear-gradient(90deg,rgba(226,226,226,1)_9%,_rgba(238,238,238,1)_18%,_rgba(226,226,226,1)_31%)] [background-size:1300px_100%]",
      classNames,
    )}
    style={{ width: `${width}px` }}
  />
);

export default Shimmer;
