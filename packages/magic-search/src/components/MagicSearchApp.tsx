import { createPortal } from "react-dom";
import MagicSearchComponent from "./MagicSearch";
import { MagicSearchProps } from "../utils/types";
import { ConfigurationProvider } from "../context/ConfigurationProvider";
import ErrorBoundary from "./ErrorBoundary";

const MagicSearchApp = (props: MagicSearchProps) =>
  createPortal(
    <ErrorBoundary>
      <ConfigurationProvider configuration={props.configuration}>
        <MagicSearchComponent {...props} />
      </ConfigurationProvider>
    </ErrorBoundary>,
    document.body,
  );

export default MagicSearchApp;
