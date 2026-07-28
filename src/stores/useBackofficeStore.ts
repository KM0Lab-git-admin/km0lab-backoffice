import { create } from "zustand";
import type { Promocio } from "@/types/comerc";
import { promocionsFixture } from "@/data/fixtures/promocions";

type BackofficeState = {
  promocions: Promocio[];
  setPromocions: (promocions: Promocio[]) => void;
  upsertPromocio: (promocio: Promocio) => void;
  removePromocio: (id: string) => void;
  togglePromocio: (id: string, activa: boolean) => void;
};

export const useBackofficeStore = create<BackofficeState>((set) => ({
  promocions: promocionsFixture,
  setPromocions: (promocions) => set({ promocions }),
  upsertPromocio: (promocio) =>
    set((state) => {
      const idx = state.promocions.findIndex((p) => p.id === promocio.id);
      if (idx === -1) return { promocions: [...state.promocions, promocio] };
      const next = state.promocions.slice();
      next[idx] = promocio;
      return { promocions: next };
    }),
  removePromocio: (id) =>
    set((state) => ({ promocions: state.promocions.filter((p) => p.id !== id) })),
  togglePromocio: (id, activa) =>
    set((state) => ({
      promocions: state.promocions.map((p) => (p.id === id ? { ...p, activa } : p)),
    })),
}));
