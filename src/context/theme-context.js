"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("system");

  const getSystemTheme = () => {
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  };

  // On mount: load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("theme-preference");
    if (stored) 
        setTheme(stored);
  }, []);

  // When theme changes, update <html> and localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const effectiveTheme = theme === "system" ? getSystemTheme() : theme;
    const root = document.documentElement;

    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${effectiveTheme}`);

    localStorage.setItem("theme-preference", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};