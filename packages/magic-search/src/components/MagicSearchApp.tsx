import { createPortal } from "react-dom";
import MagicSearchComponent from "./MagicSearch";
import { MagicSearchAppProps } from "../utils/types";
import { ConfigurationProvider } from "../context/ConfigurationProvider";
import ErrorBoundary from "./ErrorBoundary";
import { LoggerProvider } from "../context/LoggerProvider";

const MagicSearchApp = (props: MagicSearchAppProps) =>
  createPortal(
    <LoggerProvider logger={props.logger}>
      <ErrorBoundary>
        <ConfigurationProvider configuration={props.configuration}>
          <MagicSearchComponent {...props} />
        </ConfigurationProvider>
      </ErrorBoundary>
    </LoggerProvider>,
    document.body,
  );

export default MagicSearchApp;
