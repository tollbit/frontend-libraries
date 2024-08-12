import { ReactElement } from "react";
import { z } from "zod";
import {
  ParsedInputParams,
  TileResponse,
  Tool,
  ToolForStreaming,
  RawTool,
} from "./types";

const formatTileToRawTool = (tile: TileResponse): RawTool => {
  let params: ParsedInputParams = { properties: {} };
  try {
    const propertyMap = new Map<string, any>();
    tile.inputParams?.forEach((i) =>
      propertyMap.set(i.name, {
        enum: i.enums,
        type: i.type,
        description: i.description,
      }),
    );
    params.properties = Object.fromEntries(propertyMap.entries());
  } catch (e) {
    // don't log error if the params are empty as this is a normal usecase
    if (tile.inputParams !== null) {
      console.error("Error parsing input params", e);
    }
  }

  const parameters = {
    ...Object.entries(params.properties).reduce((acc, [key, value]) => {
      if (value?.enum && value?.enum?.length > 0) {
        return {
          ...acc,
          [key]: {
            type: "string",
            description: value.description,
            enum: value.enum,
          },
        };
      }

      return {
        ...acc,
        [key]: {
          type: value.type,
          description: value.description,
        },
      };
    }, {}),
  };

  return {
    name: tile.name.replace(/\s/g, "_"),
    description: tile.description,
    parameters,
  };
};

const formatTileToTool = (tile: TileResponse): Tool => {
  let params: ParsedInputParams = { properties: {} };
  try {
    const propertyMap = new Map<string, any>();
    tile.inputParams?.forEach((i) =>
      propertyMap.set(i.name, {
        enum: i.enums,
        type: i.type,
        description: i.description,
      }),
    );
    params.properties = Object.fromEntries(propertyMap.entries());
  } catch (e) {
    // don't log error if the params are empty as this is a normal usecase
    if (tile.inputParams !== null) {
      console.error("Error parsing input params", e);
    }
  }

  const parameters = z.object({
    ...Object.entries(params.properties).reduce((acc, [key, value]) => {
      // If the value is an enum ignore the type and use the zod enum schema
      if (value?.enum && value?.enum?.length > 0) {
        return {
          ...acc,
          [key]: z
            .enum(value.enum as [string, ...string[]])
            .describe(value.description),
        };
      }
      if (value?.type === "string") {
        return { ...acc, [key]: z.string().describe(value.description) };
      }
      if (value?.type === "number") {
        return { ...acc, [key]: z.number().describe(value.description) };
      }
      return acc;
    }, {}),
  });

  return {
    name: tile.name.replace(/\s/g, "_"),
    description: tile.description,
    parameters,
  };
};

export const formatTilesToStreamTools = (
  agent: string,
  tiles: TileResponse[],
  apiKey: string,
  generateFunction: (_args: {
    tile: TileResponse;
    params: any;
    apiKey: string;
    agent: string;
  }) => Promise<ReactElement>,
): { [key: string]: ToolForStreaming } =>
  tiles.reduce((acc, tile) => {
    const tool = formatTileToTool(tile);
    return {
      ...acc,
      [tool.name]: {
        ...tool,
        generate: async function (params: any) {
          return await generateFunction({
            tile,
            params,
            apiKey,
            agent,
          });
        },
      },
    };
  }, {});

export const formatTilesToTools = (
  tiles: TileResponse[],
): { [key: string]: Tool } =>
  tiles.reduce((acc, tile) => {
    const tool = formatTileToTool(tile);
    return {
      ...acc,
      [tool.name]: tool,
    };
  }, {});

export const formatTilesToRawTools = (
  tiles: TileResponse[],
): { [key: string]: RawTool } =>
  tiles.reduce((acc, tile) => {
    const tool = formatTileToRawTool(tile);
    return {
      ...acc,
      [tool.name]: tool,
    };
  }, {});

export * from "./types";
