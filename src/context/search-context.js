"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    const st_search = sessionStorage.getItem("card-search");
    const st_filters = sessionStorage.getItem("search-filters");

    if (st_search) 
        setSearch(st_search);

    if (st_filters)
      setFilters(st_filters);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("card-search", search);
    sessionStorage.setItem("search-filters", filters);
  }, [search, filters]);

  return (
    <SearchContext.Provider value={{ search, setSearch, filters, setFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};