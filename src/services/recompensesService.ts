import type { Recompensa, RecompensaInput } from "@/types/backoffice";
import { useAdminRecompensesStore } from "@/stores/useAdminRecompensesStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { comercosOptionsFixture } from "@/data/fixtures/accions";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms + Math.random() * 250));

function newId(): string {
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const recompensesService = {
  async list(): Promise<Recompensa[]> {
    await delay(400);
    const { poblacioId } = useSessionStore.getState();
    return useAdminRecompensesStore
      .getState()
      .recompenses.filter((r) => r.poblacioId === poblacioId);
  },

  async get(id: string): Promise<Recompensa | undefined> {
    await delay(200);
    return useAdminRecompensesStore.getState().recompenses.find((r) => r.id === id);
  },

  async create(input: RecompensaInput): Promise<Recompensa> {
    await delay(500);
    const { poblacioId } = useSessionStore.getState();
    const r: Recompensa = { ...input, id: newId(), poblacioId };
    useAdminRecompensesStore.getState().upsert(r);
    return r;
  },

  async update(id: string, input: RecompensaInput): Promise<Recompensa> {
    await delay(500);
    const current = useAdminRecompensesStore.getState().recompenses.find((r) => r.id === id);
    const poblacioId = current?.poblacioId ?? useSessionStore.getState().poblacioId;
    const r: Recompensa = { ...input, id, poblacioId };
    useAdminRecompensesStore.getState().upsert(r);
    return r;
  },

  async setEstat(id: string, estat: Recompensa["estat"]): Promise<void> {
    await delay(250);
    useAdminRecompensesStore.getState().setEstat(id, estat);
  },

  async remove(id: string): Promise<void> {
    await delay(300);
    useAdminRecompensesStore.getState().remove(id);
  },

  async getComercosOptions() {
    await delay(150);
    return comercosOptionsFixture;
  },
};
