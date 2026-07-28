import { create } from "zustand";
import type { AccioPunts } from "@/types/backoffice";
import { accionsPuntsFixture } from "@/data/fixtures/accions";

type State = {
  accions: AccioPunts[];
  upsert: (accio: AccioPunts) => void;
  remove: (id: string) => void;
  toggle: (id: string, activa: boolean) => void;
};

export const useAdminAccionsStore = create<State>((set) => ({
  accions: accionsPuntsFixture,
  upsert: (accio) =>
    set((state) => {
      const idx = state.accions.findIndex((a) => a.id === accio.id);
      if (idx === -1) return { accions: [...state.accions, accio] };
      const next = state.accions.slice();
      next[idx] = accio;
      return { accions: next };
    }),
  remove: (id) =>
    set((state) => ({ accions: state.accions.filter((a) => a.id !== id) })),
  toggle: (id, activa) =>
    set((state) => ({
      accions: state.accions.map((a) => (a.id === id ? { ...a, activa } : a)),
    })),
}));
