import { useState, useCallback } from "react";

const useFilters = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const cleanFilters = useCallback(() => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== "" && value !== null && value !== undefined;
      })
    );
  }, [filters]);

  return { filters, updateFilter, cleanFilters };
};

export default useFilters;
