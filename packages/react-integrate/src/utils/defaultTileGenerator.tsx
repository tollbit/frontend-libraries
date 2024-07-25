import { ReactElement } from "react";
import { type TileResponse } from "@tollbit/core-integrate-tile";
import Tile from "../components/Tile";
import { Tollbit } from "@tollbit/client";

export const defaultTileGenerator = async function ({
  tile,
  params,
  apiKey,
  agent,
  tollbitBaseUrl,
}: {
  tile: TileResponse;
  params: any;
  apiKey: string;
  agent: string;
  tollbitBaseUrl?: string;
}): Promise<ReactElement> {
  const client = new Tollbit(apiKey, "", agent, tollbitBaseUrl);

  const data = await client.getTile(tile.cuid, params);
  return <Tile src={data?.embedUrl || ""} />;
};
