import { MAGIC_SEARCH_ID } from "./constants";

export interface MagicSearchProps {
  direction: "left" | "right";
  publicKey: string;
  configuration?: MagicSearchConfiguration;
}

export interface MagicSearchConfiguration {
  classes?: {
    [MAGIC_SEARCH_ID]?: string;
  };
  copy?: {
    searchPlaceholder?: string;
    suggestionsTitle?: string;
    introTitle?: string;
    searchResultsTitle?: string;
  };
  headerImage?: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
