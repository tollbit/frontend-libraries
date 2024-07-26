import { ReactElement } from "react";
import { ZodObject } from "zod";

interface BaseTool {
  name: string;
  description: string;
}

export interface RawTool {
  name: string;
  description: string;
  parameters: {
    [key: string]: {
      type: string;
      description: string;
      enum?: string[];
    };
  };
}

export interface Tool extends BaseTool {
  parameters: ZodObject<any>;
}

export interface ToolForStreaming extends Tool {
  generate(_params: any): Promise<ReactElement>;
}

export interface TileResponse {
  cuid: string;
  name: string;
  description: string;
  data?: string;
  inputParams: InputParamsResponse[] | null;
  furtherTopics: string;
  priceMicros: number;
  currency: string;
  embedUrl?: string;
}

export interface InputParamsResponse {
  cuid: string;
  name: string;
  description: string;
  type: string;
  required: string;
  enums: string[] | null;
}

export interface ParsedInputParams {
  properties: {
    [key: string]: {
      enum?: string[];
      type: string;
      description: string;
    };
  };
}
