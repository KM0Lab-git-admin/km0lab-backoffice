import { veinsFixture } from "@/data/fixtures/veins";
import { useSessionStore } from "@/stores/useSessionStore";
import type { VeiPrograma } from "@/types/backoffice";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms + Math.random() * 200));

export const usuarisService = {
  async list(): Promise<VeiPrograma[]> {
    await delay(350);
    const { poblacioId } = useSessionStore.getState();
    return veinsFixture.filter((v) => v.poblacioId === poblacioId);
  },
  async get(id: string): Promise<VeiPrograma | undefined> {
    await delay(250);
    return veinsFixture.find((v) => v.id === id);
  },
};
