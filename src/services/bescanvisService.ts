import type {
  Bescanvi,
  BescanviEstat,
  BescanviFiltres,
} from "@/types/backoffice";
import { useAdminBescanvisStore } from "@/stores/useAdminBescanvisStore";
import { useSessionStore } from "@/stores/useSessionStore";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms + Math.random() * 200));

function matches(b: Bescanvi, f: BescanviFiltres | undefined): boolean {
  if (!f) return true;
  if (f.query) {
    const q = f.query.trim().toLowerCase();
    if (q && !b.usuariNom.toLowerCase().includes(q)) return false;
  }
  if (f.tipus && f.tipus !== "tots" && b.recompensaTipus !== f.tipus) return false;
  if (f.estat && f.estat !== "tots" && b.estat !== f.estat) return false;
  if (f.comercId && f.comercId !== "tots" && b.comercId !== f.comercId) return false;
  if (f.pagament && f.pagament !== "tots") {
    const aplica = b.flux === "val_qr" && b.estat === "utilitzat";
    if (f.pagament === "no_aplica" && aplica) return false;
    if (f.pagament === "pendent" && (!aplica || b.pagamentEstat !== "pendent")) return false;
    if (f.pagament === "pagat" && (!aplica || b.pagamentEstat !== "pagat")) return false;
  }
  if (f.desde && b.dataSolicitud < f.desde) return false;
  if (f.fins && b.dataSolicitud > f.fins) return false;
  return true;
}


export const bescanvisService = {
  async list(filtres?: BescanviFiltres): Promise<Bescanvi[]> {
    await delay(400);
    const { poblacioId } = useSessionStore.getState();
    return useAdminBescanvisStore
      .getState()
      .bescanvis.filter((b) => b.poblacioId === poblacioId && matches(b, filtres))
      .sort((a, b) => b.dataSolicitud.localeCompare(a.dataSolicitud));
  },

  async get(id: string): Promise<Bescanvi | undefined> {
    await delay(200);
    return useAdminBescanvisStore.getState().bescanvis.find((b) => b.id === id);
  },

  async updateEstat(id: string, estat: BescanviEstat, nota?: string): Promise<void> {
    await delay(300);
    useAdminBescanvisStore.getState().updateEstat(id, estat, nota);
  },

  async cancel(id: string, nota?: string): Promise<void> {
    await delay(300);
    useAdminBescanvisStore.getState().updateEstat(id, "cancel·lat", nota);
  },
};
