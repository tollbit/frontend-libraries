import React from "react";
import { useConfiguration } from "../context/ConfigurationProvider";
import { LOADING_SPINNER_ID } from "../utils/constants";
import { getClassOverride } from "../utils";

const LoadingSpinner = () => {
  const configuration = useConfiguration();
  return (
    <div className="magic-search-loader-container">
      <div
        className={`${LOADING_SPINNER_ID} ${getClassOverride(LOADING_SPINNER_ID, configuration.classes)}`}
      />
    </div>
  );
};
export default LoadingSpinner;
