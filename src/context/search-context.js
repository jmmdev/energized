"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  
  useEffect(() => {
      console.log("APPLIED FILTERS", appliedFilters);
  }, [appliedFilters])
  
  return (
    <SearchContext.Provider value={{ search, setSearch, filters, setFilters, appliedFilters, setAppliedFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};