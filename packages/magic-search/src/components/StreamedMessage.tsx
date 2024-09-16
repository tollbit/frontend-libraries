import React, { useState, useEffect } from "react";

const StreamedMessage = ({ message }: { message: string }) => {
  const [processedMessage, setProcessedMessage] = useState("");

  useEffect(() => {
    let buffer = "";
    let isCitation = false;
    let citationIndex = 1;

    const processMessage = (msg: string) => {
      let result = "";
      for (let char of msg) {
        if (char === "(") {
          isCitation = true;
          buffer += char;
          continue;
        }

        if (isCitation) {
          buffer += char;
          if (char === ")") {
            isCitation = false;
            const citation = buffer.slice(1, -1); // Remove parentheses
            result += `<a href="${citation}" target="_blank">[${citationIndex}]</a>`;
            citationIndex++;
            buffer = "";
          }
        } else {
          result += char;
        }
      }
      return result;
    };

    const updatedMessage = processMessage(message);
    setProcessedMessage(updatedMessage);
  }, [message]);

  return (
    <div
      className="magic-search-streamed-message"
      dangerouslySetInnerHTML={{ __html: processedMessage }}
    />
  );
};

export default StreamedMessage;
