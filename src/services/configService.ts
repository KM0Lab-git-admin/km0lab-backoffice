import { api } from "@/lib/apiClient";
import { configFromTown, configToTownUpdate } from "@/lib/mappers/admin";
import { useSessionStore } from "@/stores/useSessionStore";
import type { PoblacioConfig, PoblacioConfigInput } from "@/types/backoffice";
import type { ApiTown } from "@/types/api";

export const configService = {
  async get(_poblacioId?: string): Promise<PoblacioConfig> {
    const town = await api.get<ApiTown>("/towns/me");
    return configFromTown(town);
  },

  async update(
    poblacioId: string,
    input: PoblacioConfigInput,
  ): Promise<PoblacioConfig> {
    const town = await api.patch<ApiTown>(
      `/towns/${poblacioId}`,
      configToTownUpdate(input),
    );
    useSessionStore.getState().setSession({
      ...useSessionStore.getState(),
      poblacioId: town.id,
    });
    return configFromTown(town);
  },

  async exportData(poblacioId: string): Promise<{ ok: true; poblacioId: string }> {
    // Not implemented in API yet.
    return { ok: true, poblacioId };
  },

  async regenerateCredentials(
    poblacioId: string,
  ): Promise<{ ok: true; poblacioId: string }> {
    return { ok: true, poblacioId };
  },

  async deactivateProgram(
    poblacioId: string,
  ): Promise<{ ok: true; poblacioId: string }> {
    return { ok: true, poblacioId };
  },
};
