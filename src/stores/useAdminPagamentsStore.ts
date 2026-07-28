import { create } from "zustand";
import type { PagamentComerc } from "@/types/backoffice";
import { pagamentsFixture } from "@/data/fixtures/pagaments";
import { useAdminBescanvisStore } from "@/stores/useAdminBescanvisStore";

type State = {
  pagaments: PagamentComerc[];
  registrar: (input: {
    comercId: string;
    comercNom: string;
    poblacioId: string;
    bescanviIds: string[];
    importTotal: number;
    nota?: string;
  }) => PagamentComerc;
};

export const useAdminPagamentsStore = create<State>((set) => ({
  pagaments: pagamentsFixture,
  registrar: (input) => {
    const data = new Date().toISOString();
    const id = `p-${Date.now()}`;
    const pagament: PagamentComerc = {
      id,
      poblacioId: input.poblacioId,
      comercId: input.comercId,
      comercNom: input.comercNom,
      data,
      bescanviIds: input.bescanviIds,
      importTotal: input.importTotal,
      nota: input.nota,
    };
    set((state) => ({ pagaments: [pagament, ...state.pagaments] }));
    useAdminBescanvisStore.getState().markPagats(input.bescanviIds, id, data);
    return pagament;
  },
}));
