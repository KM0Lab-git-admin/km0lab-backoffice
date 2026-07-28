import type { PoblacioConfig, PoblacioConfigInput } from "@/types/backoffice";
import { useAdminConfigStore } from "@/stores/useAdminConfigStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { poblacioConfigFixture } from "@/data/fixtures/configuracio";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms + Math.random() * 200));

export const configService = {
  async get(poblacioId?: string): Promise<PoblacioConfig> {
    await delay(300);
    const id = poblacioId ?? useSessionStore.getState().poblacioId;
    const existing = useAdminConfigStore.getState().configs[id];
    if (existing) return existing;
    // Fall back to fixture, scoped to the requested població.
    return { ...poblacioConfigFixture, poblacioId: id };
  },

  async update(poblacioId: string, input: PoblacioConfigInput): Promise<PoblacioConfig> {
    await delay(500);
    const current =
      useAdminConfigStore.getState().configs[poblacioId] ?? {
        ...poblacioConfigFixture,
        poblacioId,
      };
    const next: PoblacioConfig = { ...current, ...input, poblacioId };
    useAdminConfigStore.getState().upsert(next);
    return next;
  },

  async exportData(poblacioId: string): Promise<{ ok: true; poblacioId: string }> {
    await delay(700);
    return { ok: true, poblacioId };
  },

  async regenerateCredentials(poblacioId: string): Promise<{ ok: true; poblacioId: string }> {
    await delay(600);
    return { ok: true, poblacioId };
  },

  async deactivateProgram(poblacioId: string): Promise<{ ok: true; poblacioId: string }> {
    await delay(800);
    return { ok: true, poblacioId };
  },
};
