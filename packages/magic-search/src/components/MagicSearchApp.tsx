import { createPortal } from "react-dom";
import MagicSearchComponent from "./MagicSearch";
import { MagicSearchAppProps } from "../utils/types";
import { ConfigurationProvider } from "../context/ConfigurationProvider";
import ErrorBoundary from "./ErrorBoundary";
import { LoggerProvider } from "../context/LoggerProvider";
import { TrackerProvider } from "../context/TrackerProvider";

const MagicSearchApp = (props: MagicSearchAppProps) =>
  createPortal(
    <LoggerProvider logger={props.logger}>
      <TrackerProvider>
        <ErrorBoundary>
          <ConfigurationProvider configuration={props.configuration}>
            <MagicSearchComponent {...props} />
          </ConfigurationProvider>
        </ErrorBoundary>
      </TrackerProvider>
    </LoggerProvider>,
    document.body,
  );

export default MagicSearchApp;
