export interface MagicSearchProps {
  direction: "left" | "right";
  shiftBody?: boolean;
  publicKey: string;
  configuration?: MagicSearchConfiguration;
}

export interface MagicSearchConfiguration {
  classes?: {
    [key in string]?: string;
  };
  copy?: {
    searchPlaceholder?: string;
    suggestionsTitle?: string;
    introTitle?: string;
    searchResultsTitle?: string;
    showMoreButton?: string;
  };
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
