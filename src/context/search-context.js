"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("card-search");

    if (stored) 
        setSearch(stored);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("card-search", search);
  }, [search]);

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};