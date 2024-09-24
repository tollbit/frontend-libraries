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

interface Tracker {
  trackEvent: (eventName: string, options?: any, eventData?: any) => void;
  trackPageview: (eventData?: any, options?: any) => void;
}

export const TrackerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const plausible = Plausible({
    domain: "tollbit.com",
    trackLocalhost: true,
  });

  const tracker: Tracker = {
    trackEvent: (eventName: string, options?: any, eventData?: any) =>
      plausible.trackEvent(eventName, options, eventData),
    trackPageview: (eventData?: any, options?: any) =>
      plausible.trackPageview(eventData, options),
  };

  return (
    <TrackerContext.Provider value={{ tracker }}>
      {children}
    </TrackerContext.Provider>
  );
};
