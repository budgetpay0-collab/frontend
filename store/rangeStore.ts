import { create } from "zustand";

export type RangeKey = "D" | "W" | "M" | "Y";

interface RangeStore {
  activeRange: RangeKey;
  setActiveRange: (range: RangeKey) => void;
}

export const useRangeStore = create<RangeStore>()((set) => ({
  activeRange: "D",
  setActiveRange: (range) => set({ activeRange: range }),
}));
