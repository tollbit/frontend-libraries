import { Logtail } from "@logtail/browser";

export interface MagicSearchProps {
  direction: "left" | "right";
  shiftBody?: boolean;
  publicKey: string;
  configuration?: MagicSearchConfiguration;
}

export interface MagicSearchAppProps extends MagicSearchProps {
  logger: Logtail;
}

export interface MagicSearchConfiguration {
  classes?: {
    [_key in string]?: string;
  };
  copy?: {
    searchPlaceholder?: string;
    suggestionsTitle?: string;
    introTitle?: string;
    searchResultsTitle?: string;
    showMoreButton?: string;
  };
  tabGradient?: Gradient;
  showMobileFloatingButton?: boolean;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Gradient {
  gradientColors: GradientColor[];
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
}

export interface GradientColor {
  stopColor: string;
  offset: string;
}
