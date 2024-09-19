const Shimmer = ({ width }: { width: number }) => (
  <div
    className="h-4 mb-3 rounded-xl animate-[shimmering_2.1s_linear_infinite] bg-[rgba(226,226,226,1)] bg-[linear-gradient(90deg,rgba(226,226,226,1)_9%,_rgba(238,238,238,1)_18%,_rgba(226,226,226,1)_31%)] [background-size:1300px_100%]"
    style={{ width: `${width}px` }}
  />
);

export default Shimmer;
