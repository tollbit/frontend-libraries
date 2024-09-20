import { createPortal } from "react-dom";
import MagicSearchComponent from "./MagicSearch";
import { MagicSearchProps } from "../utils/types";
import { ConfigurationProvider } from "../context/ConfigurationProvider";

const MagicSearchApp = (props: MagicSearchProps) =>
  createPortal(
    <ConfigurationProvider configuration={props.configuration}>
      <MagicSearchComponent {...props} />
    </ConfigurationProvider>,
    document.body,
  );

export default MagicSearchApp;
