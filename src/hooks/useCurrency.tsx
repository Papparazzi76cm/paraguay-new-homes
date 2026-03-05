import { createContext, useContext, useState, type ReactNode } from "react";
import type { DisplayCurrency } from "@/components/CurrencyToggle";

interface CurrencyContextType {
  displayCurrency: DisplayCurrency;
  setDisplayCurrency: (c: DisplayCurrency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  displayCurrency: "USD",
  setDisplayCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("USD");
  return (
    <CurrencyContext.Provider value={{ displayCurrency, setDisplayCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
