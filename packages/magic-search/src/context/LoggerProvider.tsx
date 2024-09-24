import { type Logtail } from "@logtail/browser";
import { createContext, useContext } from "react";

export const LoggerContext = createContext<{ logger: Logtail } | null>(null);

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error("useLogger must be used within a LoggerProvider");
  }
  return context.logger;
};

export const LoggerProvider = ({
  children,
  logger,
}: {
  children: React.ReactNode;
  logger: Logtail;
}) => {
  return (
    <LoggerContext.Provider value={{ logger }}>
      {children}
    </LoggerContext.Provider>
  );
};
