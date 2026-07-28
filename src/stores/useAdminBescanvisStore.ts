import { create } from "zustand";
import type { Bescanvi, BescanviEstat } from "@/types/backoffice";
import { bescanvisFixture } from "@/data/fixtures/bescanvis";

function parseImportNum(imp?: string): number {
  if (!imp) return 0;
  const m = imp.replace(",", ".").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

type State = {
  bescanvis: Bescanvi[];
  updateEstat: (id: string, estat: BescanviEstat, nota?: string) => void;
  markPagats: (ids: string[], pagamentId: string, data: string) => void;
  consumirVal: (id: string, comercId: string, comercNom: string) => void;
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
  markPagats: (ids, pagamentId, data) =>
    set((state) => {
      const set = new Set(ids);
      return {
        bescanvis: state.bescanvis.map((b) =>
          set.has(b.id)
            ? { ...b, pagamentEstat: "pagat", pagamentId, dataPagament: data }
            : b,
        ),
      };
    }),
  consumirVal: (id, comercId, comercNom) =>
    set((state) => ({
      bescanvis: state.bescanvis.map((b) => {
        if (b.id !== id) return b;
        const data = new Date().toISOString();
        const historial = [
          ...(b.historial ?? []),
          { estat: "utilitzat" as BescanviEstat, data, nota: `Validat a ${comercNom}` },
        ];
        return {
          ...b,
          estat: "utilitzat",
          comercId,
          comercNom,
          dataUs: data,
          importAplicat: b.import,
          importPagatNum: b.importPagatNum ?? parseImportNum(b.import),
          pagamentEstat: "pendent",
          historial,
        };
      }),
    })),
}));
