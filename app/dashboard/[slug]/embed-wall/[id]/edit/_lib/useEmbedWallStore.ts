import { create } from "zustand";
import { EmbedWallContextData, IncludedIds, ResponsesById } from "./types";

interface EmbedWallState {
  responsesById: ResponsesById;
  includedIds: IncludedIds;
  hydrate: (data: EmbedWallContextData) => void;
  toggleResponseInclusion: (id: string) => void;
  bulkSetResponseInclusion: (ids: string[], include: boolean) => void;
  setIncludedIds: (ids: string[]) => void;
}

export const useEmbedWallStore = create<EmbedWallState>((set) => ({
  responsesById: {},
  includedIds: [],

  hydrate: (data) => {
    set({ responsesById: data.responsesById, includedIds: data.includedIds });
  },

  toggleResponseInclusion: (id) =>
    set((state) => {
      const isIncluded = state.includedIds.includes(id);

      return {
        includedIds: isIncluded
          ? state.includedIds.filter((x) => x !== id)
          : [...state.includedIds, id], // append to end
      };
    }),
  bulkSetResponseInclusion: (ids, include) =>
    set((state) => {
      if (include) {
        const merged = new Set([...state.includedIds, ...ids]);
        return { includedIds: Array.from(merged) };
      }

      return {
        includedIds: state.includedIds.filter((id) => !ids.includes(id)),
      };
    }),
  setIncludedIds: (ids) => set(() => ({ includedIds: ids })),
}));
