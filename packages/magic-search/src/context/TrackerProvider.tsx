import { createContext, useContext } from "react";
import Plausible from "plausible-tracker";

export const TrackerContext = createContext<{
  tracker: Tracker;
} | null>(null);

export const useTracker = (): Tracker => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error("useTracker must be used within a TrackerProvider");
  }
  return context.tracker;
};

interface Options {
  props?: { [key: string]: any };
  [key: string]: any;
}

interface Tracker {
  trackEvent: (eventName: string, options?: Options, eventData?: any) => void;
  trackPageview: (eventData?: any, options?: Options) => void;
}

export const TrackerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const plausible = Plausible({
    domain: "api.tollbit.com",
  });

  let domain = "";
  if (typeof window !== "undefined") {
    domain = window.location.hostname;
  }

  const tracker: Tracker = {
    trackEvent: (eventName: string, options?: Options, eventData?: any) =>
      plausible.trackEvent(
        eventName,
        {
          ...options,
          props: { domain, ...options?.props },
        },
        eventData,
      ),
    trackPageview: (eventData?: any, options?: Options) =>
      plausible.trackPageview(eventData, {
        ...options,
        props: { domain, ...options?.props },
      }),
  };

  return (
    <TrackerContext.Provider value={{ tracker }}>
      {children}
    </TrackerContext.Provider>
  );
};
