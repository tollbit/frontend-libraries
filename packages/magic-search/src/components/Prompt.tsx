import React from "react";

const Prompt = ({
  question,
  setLastSearchValue,
}: {
  question: string;
  setLastSearchValue: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <button
    className="magic-search-prompt"
    onClick={() => setLastSearchValue(question)}
  >
    {question}
  </button>
);

export default Prompt;
