import React from "react";
import { createPortal } from "react-dom";
import MagicSearchComponent from "./MagicSearch";
import { MagicSearchProps } from "../utils/types";

const MagicSearchApp = (props: MagicSearchProps) =>
  createPortal(<MagicSearchComponent {...props} />, document.body);

export default MagicSearchApp;
