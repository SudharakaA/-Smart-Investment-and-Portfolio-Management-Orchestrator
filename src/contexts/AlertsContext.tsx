import { createContext, ReactNode, useContext } from "react";
import { useLiveAlerts } from "@/hooks/useLiveAlerts";

type AlertsContextValue = ReturnType<typeof useLiveAlerts>;

const AlertsContext = createContext<AlertsContextValue | null>(null);

export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const alertsState = useLiveAlerts(80);
  return <AlertsContext.Provider value={alertsState}>{children}</AlertsContext.Provider>;
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within AlertsProvider");
  }
  return context;
};
