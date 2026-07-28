import { create } from "zustand";
import type { Recompensa } from "@/types/backoffice";
import { recompensesFixture } from "@/data/fixtures/recompenses";

type State = {
  recompenses: Recompensa[];
  upsert: (r: Recompensa) => void;
  remove: (id: string) => void;
  setEstat: (id: string, estat: Recompensa["estat"]) => void;
};

export const useAdminRecompensesStore = create<State>((set) => ({
  recompenses: recompensesFixture,
  upsert: (r) =>
    set((state) => {
      const idx = state.recompenses.findIndex((x) => x.id === r.id);
      if (idx === -1) return { recompenses: [...state.recompenses, r] };
      const next = state.recompenses.slice();
      next[idx] = r;
      return { recompenses: next };
    }),
  remove: (id) =>
    set((state) => ({ recompenses: state.recompenses.filter((x) => x.id !== id) })),
  setEstat: (id, estat) =>
    set((state) => ({
      recompenses: state.recompenses.map((x) => (x.id === id ? { ...x, estat } : x)),
    })),
}));
