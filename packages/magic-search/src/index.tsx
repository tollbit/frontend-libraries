import { createRoot } from "react-dom/client";
import MagicSearchApp from "./components/MagicSearchApp";
import { MagicSearchProps } from "./utils/types";
import { MAGIC_SEARCH_ID } from "./utils/constants";
import { Logtail } from "@logtail/browser";

function MagicSearch(props: MagicSearchProps) {
  const logtail = new Logtail("mYVP7ShBKVi6N6q5NYnq6aPT");
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="${MAGIC_SEARCH_ID}"></div>`,
  );
  const rootNode = document.getElementById(MAGIC_SEARCH_ID);
  if (!rootNode) {
    return;
  }
  const root = createRoot(rootNode);
  root.render(<MagicSearchApp {...props} logger={logtail} />);
}

// @ts-expect-error
window.MagicSearch = MagicSearch;
