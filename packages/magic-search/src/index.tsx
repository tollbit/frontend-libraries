import { createRoot } from "react-dom/client";
import MagicSearchApp from "./components/MagicSearchApp";
import { MagicSearchProps } from "./utils/types";
import { MAGIC_SEARCH_ID } from "./utils/constants";

function MagicSearch(props: MagicSearchProps) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="${MAGIC_SEARCH_ID}"></div>`,
  );
  const rootNode = document.getElementById(MAGIC_SEARCH_ID);
  if (!rootNode) {
    return;
  }
  const root = createRoot(rootNode);
  root.render(<MagicSearchApp {...props} />);
}

// @ts-expect-error
window.MagicSearch = MagicSearch;
