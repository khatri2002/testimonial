import { create } from "zustand";

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (query: string) => set({ query }),
  clear: () => set({ query: "" }),
}));
