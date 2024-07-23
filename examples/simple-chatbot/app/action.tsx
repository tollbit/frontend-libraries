"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { ReactElement, ReactNode } from "react";
import { nanoid } from "nanoid";
import {formatTilesToStreamTools, type TileResponse}from "@tollbit/core-integrate-tile";
import TollBitTile from "../lib/TollBitTile";
import { Tollbit } from "@tollbit/tollbit-node-sdk";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
  isText?: boolean;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
  isText?: boolean;
}

export async function continueConversation(
  input: string,
  tiles: TileResponse[],
): Promise<ClientMessage> {
  "use server";
  const model = openai("gpt-4o");
  const history = getMutableAIState();
  const tools = formatTilesToStreamTools(
    process.env.CHAT_AGENT || "",
    tiles,
    process.env.TOLLBIT_API_KEY!,
    async function ({ tile, params, apiKey, agent }): Promise<ReactElement> {
      const client = new Tollbit(
        apiKey,
        "",
        agent,
        process.env.NEXT_PUBLIC_TOLLBIT_BASE_URL
      );

      const data = await client.getTile(tile.cuid, params);
      let textResponse = "";

      if (data?.data) {
        const modelResponse = await generateText({
          model,
          system:
            "You summarize json input into a few sentences describing the data. The text accompanies a visualization of the data should just be a brief description of the data to add to the visualization",
          prompt: `${data.data}`,
        });
        textResponse = modelResponse.text;
      }

      return <TollBitTile tile={data} textResponse={textResponse} />;
    }
  );
  let generatedText = false;
  const result = await streamUI({
    model,
    messages: [
      ...history.get(),
      { role: "user", content: input, isText: true },
    ],
    text: ({ content, done }) => {
      if (done) {
        generatedText = true;
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content, isText: true },
        ]);
      }

      return <span className="my-3 text-[1.1rem] leading-6">{content}</span>;
    },
    tools,
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
    isText: generatedText,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
