import React from "react";
import { useConfiguration } from "../context/ConfigurationProvider";

const LoadingSpinner = () => {
  const configuration = useConfiguration();
  return (
    <div className="magic-search-loader-container">
      <div className="magic-search-loader" />
    </div>
  );
};
export default LoadingSpinner;
