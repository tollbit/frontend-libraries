import React from "react";

const Prompt = ({
  question,
  submitSearch,
}: {
  question: string;
  submitSearch: () => void;
}) => (
  <button className="magic-search-prompt" onClick={submitSearch}>
    {question}
  </button>
);

export default Prompt;
