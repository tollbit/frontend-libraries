"use client";
import { useState, useEffect } from "react";
import Tile from "./Tile";
import fetchTile from "./fetchTile";
import { TileResponse } from "./types";
import ArrowRightButton from "@/components/ui/ArrowRightButton";
import { sendMessage } from "@/lib/utils/sendMessage";

export default function TollbitTile({
  cuid,
  apiKey,
  userAgent,
  parameters,
  textResponse,
}: {
  cuid: string;
  apiKey: string;
  userAgent: string;
  parameters?: { [key: string]: string | string[] | undefined | number };
  textResponse?: string;
}) {
  const [data, setData] = useState<TileResponse[] | null>(null);
  const [topics, setFurtherTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTile({ cuid, userAgent, apiKey })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, []);

  const topicListener = (event: MessageEvent) => {
    console.log("Received message:", event);
    if (event.data.type === "topics") {
      setFurtherTopics(event.data.topics);
    }
  };

  useEffect(() => {
    window.addEventListener("message", topicListener);
    return () => {
      window.removeEventListener("message", topicListener);
    };
  }, []);

  if (loading) {
    return null;
  }

  const tile = data?.[0];
  if (!loading && (!tile || !tile.embedUrl)) {
    console.error("Could not render tile", tile);
    return null;
  }

  const furtherTopics = tile?.furtherTopics || "";
  const suggestions =
    topics ||
    furtherTopics
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  return (
    <>
      {textResponse && (
        <div className="pt-1 mb-4 text-[1.1rem] leading-6 text-gray-700">
          {textResponse}
        </div>
      )}
      <Tile src={tile?.embedUrl || ""} parameters={parameters || {}} />
      {suggestions.length > 0 && (
        <>
          <h2 className="font-semibold mt-3">Drill down further </h2>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="border-b-[.5px] border-gray-200 py-3 flex justify-between"
              role="button"
              onClick={() => sendMessage(suggestion)}
            >
              {suggestion}
              <ArrowRightButton className="opacity-50 bg-gray-400" />
            </div>
          ))}
        </>
      )}
    </>
  );
}
