import type { AccioPunts, AccioPuntsInput, AccioPuntsTipus } from "@/types/backoffice";
import { useAdminAccionsStore } from "@/stores/useAdminAccionsStore";
import { useSessionStore } from "@/stores/useSessionStore";
import {
  comercosOptionsFixture,
  esdevenimentsOptionsFixture,
} from "@/data/fixtures/accions";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms + Math.random() * 250));

function newId(): string {
  return `ap-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const accioTipusList: AccioPuntsTipus[] = [
  "registre",
  "escaneig_qr",
  "visita_web",
  "registre_web",
  "esdeveniment",
  "personalitzada",
];

export const accionsService = {
  async list(): Promise<AccioPunts[]> {
    await delay(400);
    const { poblacioId } = useSessionStore.getState();
    return useAdminAccionsStore.getState().accions.filter((a) => a.poblacioId === poblacioId);
  },

  async get(id: string): Promise<AccioPunts | undefined> {
    await delay(200);
    return useAdminAccionsStore.getState().accions.find((a) => a.id === id);
  },

  async create(input: AccioPuntsInput): Promise<AccioPunts> {
    await delay(500);
    const { poblacioId } = useSessionStore.getState();
    const accio: AccioPunts = { ...input, id: newId(), poblacioId };
    useAdminAccionsStore.getState().upsert(accio);
    return accio;
  },

  async update(id: string, input: AccioPuntsInput): Promise<AccioPunts> {
    await delay(500);
    const current = useAdminAccionsStore.getState().accions.find((a) => a.id === id);
    const poblacioId = current?.poblacioId ?? useSessionStore.getState().poblacioId;
    const accio: AccioPunts = { ...input, id, poblacioId };
    useAdminAccionsStore.getState().upsert(accio);
    return accio;
  },

  async toggle(id: string, activa: boolean): Promise<void> {
    await delay(250);
    useAdminAccionsStore.getState().toggle(id, activa);
  },

  async remove(id: string): Promise<void> {
    await delay(300);
    useAdminAccionsStore.getState().remove(id);
  },

  async getComercosOptions() {
    await delay(150);
    return comercosOptionsFixture;
  },

  async getEsdevenimentsOptions() {
    await delay(150);
    return esdevenimentsOptionsFixture;
  },
};
