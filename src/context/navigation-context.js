"use client";

import { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [lastPage, setLastPage] = useState("/");

  return (
    <NavigationContext.Provider value={{ lastPage, setLastPage }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useSearch must be used within a SearchProvider");
    return context;
}