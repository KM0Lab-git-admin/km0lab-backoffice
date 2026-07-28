import { create } from "zustand";
import type { ComercAdmin, ComercEstat } from "@/types/backoffice";
import { comercosFixture } from "@/data/fixtures/comercos";

type State = {
  comercos: ComercAdmin[];
  upsert: (c: ComercAdmin) => void;
  remove: (id: string) => void;
  setEstat: (id: string, estat: ComercEstat) => void;
};

export const useAdminComercosStore = create<State>((set) => ({
  comercos: comercosFixture,
  upsert: (c) =>
    set((state) => {
      const idx = state.comercos.findIndex((x) => x.id === c.id);
      if (idx === -1) return { comercos: [...state.comercos, c] };
      const next = state.comercos.slice();
      next[idx] = c;
      return { comercos: next };
    }),
  remove: (id) =>
    set((state) => ({ comercos: state.comercos.filter((x) => x.id !== id) })),
  setEstat: (id, estat) =>
    set((state) => ({
      comercos: state.comercos.map((x) => (x.id === id ? { ...x, estat } : x)),
    })),
}));
