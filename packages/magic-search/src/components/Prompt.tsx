import React from "react";

const Prompt = ({
  question,
  submitPrompt,
}: {
  question: string;
  submitPrompt: (prompt: string) => void;
}) => (
  <button
    className="magic-search-suggestion"
    onClick={() => submitPrompt(question)}
  >
    {question}
  </button>
);

export default Prompt;
