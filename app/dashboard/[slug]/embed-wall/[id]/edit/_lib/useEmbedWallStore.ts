import { create } from "zustand";
import { EmbedWallContextData, IncludedIds, ResponsesById } from "./types";

interface EmbedWallState {
  id: string | null;
  responsesById: ResponsesById;
  includedIds: IncludedIds;
  published: boolean | null;
  hydrate: (data: EmbedWallContextData) => void;
  toggleResponseInclusion: (id: string) => void;
  bulkSetResponseInclusion: (ids: string[], include: boolean) => void;
  setIncludedIds: (ids: string[]) => void;
}

export const useEmbedWallStore = create<EmbedWallState>((set) => ({
  id: null,
  responsesById: {},
  includedIds: [],
  published: null,

  hydrate: (data) =>
    set({
      id: data.id,
      responsesById: data.responsesById,
      includedIds: data.includedIds,
      published: data.published,
    }),

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
