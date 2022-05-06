import { createContext, useContext } from "react";

interface SearchContext {
  narrators: string[];
  selectedNarrator: string | undefined;
  setSelectedNarrator: (narrator: string | undefined) => void;

  searchText: string | undefined;
  setSearchText: (narrator: string | undefined) => void;
}

const searchContext = createContext<SearchContext | undefined>(undefined);
export const SearchContextProvider = searchContext.Provider;

export function useSearchContext() {
  const value = useContext(searchContext);

  if (!value) {
    throw new Error("Search context not set");
  }

  return value;
}
