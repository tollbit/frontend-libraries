"use client";
import {
  cleanUpTileListener,
  createListener,
  listenForTileMessages,
} from "@tollbit/core-integrate-tile/tileListener";

import { useEffect, useState, useRef } from "react";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { ClientMessage } from "./action";
import ArrowRightButton from "@/components/ui/ArrowRightButton";
import { BotMessageSquare, User } from "lucide-react";

const AIMessage = ({ display, isText }: ClientMessage) => {
  return (
    <li className="aiMessageContainer">
      <span className="aiIconContainer">
        <BotMessageSquare size={20} color="white" className="icon" />
      </span>
      {isText ? <>{display}</> : <div className="">{display}</div>}
    </li>
  );
};

const UserMessage = (message: ClientMessage) => (
  <li className="userMessageContainer">
    <span className="userIconContainer">
      <User size={20} color="white" className="icon" />
    </span>
    <p>{message.display}</p>
  </li>
);

export default function Home({ tiles }: { tiles: any[] }) {
  const [conversation, setConversation] = useUIState();
  const [input, setInput] = useState<string>("");
  const { continueConversation } = useActions();
  const chatRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async (input: string) => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: nanoid(), role: "user", display: input },
    ]);

    const message = await continueConversation(input, tiles, "LukeBot");

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ]);
  };

  const tileListener = createListener((message: string) => {
    sendMessage(message);
  });

  useEffect(() => {
    listenForTileMessages(tileListener);
    return () => cleanUpTileListener(tileListener);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (chatRef.current) {
        const listItems = chatRef.current.children;
        if (listItems.length > 0) {
          listItems[listItems.length - 1].scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });

    if (chatRef.current) {
      observer.observe(chatRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="chat">
      <ul className="chatList" ref={chatRef}>
        {conversation.map((message: ClientMessage, index: number) =>
          message.role === "user" ? (
            <UserMessage key={index} {...message} />
          ) : (
            <AIMessage key={index} {...message} />
          ),
        )}
      </ul>
      <div className="inputContainer">
        <div className="inputContent" onClick={() => inputRef.current?.focus()}>
          <div className="inputFlex">
            <input
              placeholder="Ask me anything..."
              className="input"
              value={input}
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.length > 0) {
                  sendMessage(input);
                  setInput("");
                }
              }}
            />
            <ArrowRightButton
              onClick={() => {
                if (input.length > 0) {
                  sendMessage(input);
                  setInput("");
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
