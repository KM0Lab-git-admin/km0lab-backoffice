import type { Bescanvi } from "@/types/backoffice";
import { useAdminBescanvisStore } from "@/stores/useAdminBescanvisStore";
import { useAdminComercosStore } from "@/stores/useAdminComercosStore";
import { useSessionStore } from "@/stores/useSessionStore";

const delay = (ms: number) =>
  new Promise((r) => setTimeout(r, ms + Math.random() * 200));

export type ValidarResult =
  | { ok: true; bescanvi: Bescanvi }
  | {
      ok: false;
      motiu: "no_trobat" | "ja_utilitzat" | "cancelat";
      bescanvi?: Bescanvi;
    };

export type ValsFiltres = {
  query?: string;
  cobrament?: "tots" | "pendent" | "pagat";
};

export type ResumCobrament = {
  nMes: number;
  importPendent: number;
  importCobrat: number;
};

function currentComerc(): { poblacioId: string; comercId: string; comercNom: string } {
  const { poblacioId, comercId } = useSessionStore.getState();
  const id = comercId ?? "";
  const comerc = useAdminComercosStore
    .getState()
    .comercos.find((c) => c.id === id);
  return { poblacioId, comercId: id, comercNom: comerc?.nom ?? id };
}

export const valsComercService = {
  async validarCodi(codiRaw: string): Promise<ValidarResult> {
    await delay(400);
    const codi = codiRaw.trim();
    const { poblacioId, comercId, comercNom } = currentComerc();
    const bescanvis = useAdminBescanvisStore.getState().bescanvis;
    const match = bescanvis.find(
      (b) =>
        b.poblacioId === poblacioId &&
        b.flux === "val_qr" &&
        b.codi === codi,
    );
    if (!match) return { ok: false, motiu: "no_trobat" };
    if (match.estat === "cancel·lat")
      return { ok: false, motiu: "cancelat", bescanvi: match };
    if (match.estat === "utilitzat")
      return { ok: false, motiu: "ja_utilitzat", bescanvi: match };
    useAdminBescanvisStore
      .getState()
      .consumirVal(match.id, comercId, comercNom);
    const updated = useAdminBescanvisStore
      .getState()
      .bescanvis.find((b) => b.id === match.id)!;
    return { ok: true, bescanvi: updated };
  },

  async list(filtres?: ValsFiltres): Promise<Bescanvi[]> {
    await delay(250);
    const { poblacioId, comercId } = currentComerc();
    const q = filtres?.query?.trim().toLowerCase();
    const cobrament = filtres?.cobrament ?? "tots";
    return useAdminBescanvisStore
      .getState()
      .bescanvis.filter((b) => {
        if (b.poblacioId !== poblacioId) return false;
        if (b.flux !== "val_qr") return false;
        if (b.estat !== "utilitzat") return false;
        if (b.comercId !== comercId) return false;
        if (cobrament === "pendent" && b.pagamentEstat !== "pendent")
          return false;
        if (cobrament === "pagat" && b.pagamentEstat !== "pagat") return false;
        if (q) {
          const ref = b.id.toLowerCase();
          const codi = (b.codi ?? "").toLowerCase();
          if (!ref.includes(q) && !codi.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (b.dataUs ?? "").localeCompare(a.dataUs ?? ""));
  },

  async resum(): Promise<ResumCobrament> {
    await delay(200);
    const { poblacioId, comercId } = currentComerc();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    let nMes = 0;
    let importPendent = 0;
    let importCobrat = 0;
    for (const b of useAdminBescanvisStore.getState().bescanvis) {
      if (b.poblacioId !== poblacioId) continue;
      if (b.flux !== "val_qr") continue;
      if (b.estat !== "utilitzat") continue;
      if (b.comercId !== comercId) continue;
      const imp = b.importPagatNum ?? 0;
      if ((b.dataUs ?? "") >= monthStart) nMes += 1;
      if (b.pagamentEstat === "pagat") importCobrat += imp;
      else importPendent += imp;
    }
    return { nMes, importPendent, importCobrat };
  },
};
