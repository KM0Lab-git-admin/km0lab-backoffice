import type {
  Bescanvi,
  DeuteComerc,
  PagamentComerc,
} from "@/types/backoffice";
import { useAdminBescanvisStore } from "@/stores/useAdminBescanvisStore";
import { useAdminPagamentsStore } from "@/stores/useAdminPagamentsStore";
import { useSessionStore } from "@/stores/useSessionStore";

const delay = (ms: number) =>
  new Promise((r) => setTimeout(r, ms + Math.random() * 150));

function isValReimborsable(b: Bescanvi): boolean {
  return b.flux === "val_qr" && b.estat === "utilitzat" && !!b.comercId;
}

export const pagamentsService = {
  async listDeutes(): Promise<DeuteComerc[]> {
    await delay(300);
    const { poblacioId } = useSessionStore.getState();
    const bescanvis = useAdminBescanvisStore
      .getState()
      .bescanvis.filter((b) => b.poblacioId === poblacioId && isValReimborsable(b));

    const map = new Map<string, DeuteComerc>();
    for (const b of bescanvis) {
      const key = b.comercId!;
      const cur =
        map.get(key) ??
        ({
          comercId: key,
          comercNom: b.comercNom ?? key,
          nBescanvisPendents: 0,
          importPendent: 0,
          importPagatHistoric: 0,
        } satisfies DeuteComerc);
      const imp = b.importPagatNum ?? 0;
      if (b.pagamentEstat === "pagat") {
        cur.importPagatHistoric += imp;
      } else {
        cur.nBescanvisPendents += 1;
        cur.importPendent += imp;
      }
      map.set(key, cur);
    }
    return Array.from(map.values()).sort((a, b) =>
      b.importPendent - a.importPendent || a.comercNom.localeCompare(b.comercNom),
    );
  },

  async listBescanvisPendents(comercId: string): Promise<Bescanvi[]> {
    await delay(200);
    const { poblacioId } = useSessionStore.getState();
    return useAdminBescanvisStore
      .getState()
      .bescanvis.filter(
        (b) =>
          b.poblacioId === poblacioId &&
          isValReimborsable(b) &&
          b.comercId === comercId &&
          b.pagamentEstat !== "pagat",
      )
      .sort((a, b) => (a.dataUs ?? "").localeCompare(b.dataUs ?? ""));
  },

  async listPagamentsComerc(comercId: string): Promise<PagamentComerc[]> {
    await delay(200);
    const { poblacioId } = useSessionStore.getState();
    return useAdminPagamentsStore
      .getState()
      .pagaments.filter(
        (p) => p.poblacioId === poblacioId && p.comercId === comercId,
      )
      .sort((a, b) => b.data.localeCompare(a.data));
  },

  async list(): Promise<PagamentComerc[]> {
    await delay(200);
    const { poblacioId } = useSessionStore.getState();
    return useAdminPagamentsStore
      .getState()
      .pagaments.filter((p) => p.poblacioId === poblacioId)
      .sort((a, b) => b.data.localeCompare(a.data));
  },

  async registrar(input: {
    comercId: string;
    comercNom: string;
    bescanviIds: string[];
    nota?: string;
  }): Promise<PagamentComerc> {
    await delay(400);
    const { poblacioId } = useSessionStore.getState();
    const bescanvis = useAdminBescanvisStore
      .getState()
      .bescanvis.filter((b) => input.bescanviIds.includes(b.id));
    const importTotal = bescanvis.reduce(
      (acc, b) => acc + (b.importPagatNum ?? 0),
      0,
    );
    return useAdminPagamentsStore.getState().registrar({
      comercId: input.comercId,
      comercNom: input.comercNom,
      poblacioId,
      bescanviIds: input.bescanviIds,
      importTotal,
      nota: input.nota,
    });
  },
};
