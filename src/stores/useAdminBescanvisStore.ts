import { create } from "zustand";
import type { Bescanvi, BescanviEstat } from "@/types/backoffice";
import { bescanvisFixture } from "@/data/fixtures/bescanvis";

type State = {
  bescanvis: Bescanvi[];
  updateEstat: (id: string, estat: BescanviEstat, nota?: string) => void;
};

export const useAdminBescanvisStore = create<State>((set) => ({
  bescanvis: bescanvisFixture,
  updateEstat: (id, estat, nota) =>
    set((state) => ({
      bescanvis: state.bescanvis.map((b) => {
        if (b.id !== id) return b;
        const data = new Date().toISOString();
        const historial = [...(b.historial ?? []), { estat, data, nota }];
        const next: Bescanvi = { ...b, estat, historial };
        if (estat === "entregat") next.dataLliurament = data;
        return next;
      }),
    })),
}));
