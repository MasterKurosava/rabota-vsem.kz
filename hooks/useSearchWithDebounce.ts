import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";

interface UseSearchWithDebounceOptions {
  initialValue?: string;
  debounceMs?: number;
  onSearchChange?: (isSearching: boolean) => void;
  onDebouncedChange?: (value: string) => void;
}

export function useSearchWithDebounce(options: UseSearchWithDebounceOptions = {}) {
  const {
    initialValue = "",
    debounceMs = 350,
    onSearchChange,
    onDebouncedChange,
  } = options;

  const [searchInput, setSearchInput] = useState(initialValue);
  const debouncedSearch = useDebounce(searchInput, debounceMs);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    const isCurrentlyDebouncing = searchInput !== debouncedSearch;
    setIsDebouncing(isCurrentlyDebouncing);
    onSearchChange?.(isCurrentlyDebouncing);
  }, [searchInput, debouncedSearch, onSearchChange]);

  useEffect(() => {
    if (debouncedSearch !== initialValue) {
      onDebouncedChange?.(debouncedSearch);
    }
  }, [debouncedSearch, onDebouncedChange, initialValue]);

  const syncValue = useCallback((value: string) => {
    if (value !== searchInput) {
      setSearchInput(value);
    }
  }, [searchInput]);

  return {
    searchInput,
    debouncedSearch,
    isDebouncing,
    setSearchInput,
    syncValue,
  };
}

