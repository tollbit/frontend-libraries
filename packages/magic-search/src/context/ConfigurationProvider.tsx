import { createContext, useContext } from "react";
import { MagicSearchConfiguration } from "../utils/types";

export const ConfigurationContext = createContext<{
  configuration: MagicSearchConfiguration;
}>({} as any);

export const useConfiguration = (): MagicSearchConfiguration => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      "useConfiguration must be used within a ConfigurationProvider",
    );
  }
  return context.configuration;
};

export const ConfigurationProvider = ({
  children,
  configuration = { classes: {}, copy: {} },
}: {
  children: React.ReactNode;
  configuration?: MagicSearchConfiguration;
}) => {
  return (
    <ConfigurationContext.Provider value={{ configuration }}>
      {children}
    </ConfigurationContext.Provider>
  );
};
