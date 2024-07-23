"use client";
import {
  cleanUpTileListener,
  createListener,
  listenForTileMessages,
} from "@tollbit/core-integrate-tile/tileListener";

import { useEffect, useState, useRef } from "react";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { ClientMessage } from "./action";
import ArrowRightButton from "@/components/ui/ArrowRightButton";
import UserIcon from "@/components/ui/UserIcon";

const AIMessage = ({ display, isText }: ClientMessage) => {
  return (
    <li className="flex flex-col my-7">
      <Avatar className="w-6 h-6 mb-3">
        <Image
          src="/tollbit-avatar.png"
          width={36}
          height={36}
          alt=""
          priority
        />
      </Avatar>
      {isText ? <>{display}</> : <div className="w-11/12">{display}</div>}
    </li>
  );
};

const UserMessage = (message: ClientMessage) => (
  <li className="relative w-auto my-7 ">
    <UserIcon />
    <h2 className="text-[1.1rem] mt-3 leading-6">{message.display}</h2>
  </li>
);

export default function Home({ tiles, name }: { tiles: any[]; name: string }) {
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
    <div className="flex flex-col w-full pb-24 mx-auto stretch relative">
      <ul className="mb-14" ref={chatRef}>

        {conversation.map((message: ClientMessage, index: number) =>
          message.role === "user" ? (
            <UserMessage key={index} {...message} />
          ) : (
            <AIMessage key={index} {...message} />
          )
        )}
      </ul>
      <div className="fixed bottom-0 mb-4 mx-auto max-w-3xl inset-x-0 animate-bounce-once">
        <div
          className="drop-shadow-[0_14px_14px_rgba(0,0,0,0.07)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.06)] rounded-full flex items-center justify-between h-16 w-full bg-background px-6 py-3"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex w-full">
            <div className=" mr-4 border-gray-400 h-5 flex items-center">
              <UserIcon />
            </div>
            <input
              placeholder="Ask me anything..."
              className="border-0  w-full focus-visible:outline-none placeholder:text-gray-300"
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
          </div>
          <ArrowRightButton
            className="bg-orange-600"
            onClick={() => {
              if (input.length > 0) {
                sendMessage(input);
                setInput("");
              }
            }}
          />
        </div>
        <p className="text-center text-gray-300 text-xs pt-3">
          This is an early-development demo. © TollBit, 2024.
        </p>
      </div>
    </div>
  );
}
