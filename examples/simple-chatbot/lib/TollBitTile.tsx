"use client";
import { Tile } from "@tollbit/react-integrate-tile";

export default function TollbitTile({
  tile,
  textResponse,
}: {
  tile: any;
  textResponse: string;
}) {
  if (!tile || !tile.embedUrl) {
    console.error("Could not render tile", tile);
    return null;
  }

  return (
    <>
      {textResponse && (
        <div className="pt-1 mb-4 text-[1.1rem] leading-6 text-gray-700">
          {textResponse}
        </div>
      )}
      <Tile src={tile?.embedUrl || ""} />
    </>
  );
}
