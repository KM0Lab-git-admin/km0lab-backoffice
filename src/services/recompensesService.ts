import { api } from "@/lib/apiClient";
import {
  recompensaFromApi,
  recompensaToApi,
  recompensaEstatToApi,
} from "@/lib/mappers/admin";
import type { Recompensa, RecompensaInput } from "@/types/backoffice";
import type { ApiReward, ApiShop } from "@/types/api";

export const recompensesService = {
  async list(): Promise<Recompensa[]> {
    const rows = await api.get<ApiReward[]>("/rewards");
    return rows.map(recompensaFromApi);
  },

  async get(id: string): Promise<Recompensa | undefined> {
    try {
      const reward = await api.get<ApiReward>(`/rewards/${id}`);
      return recompensaFromApi(reward);
    } catch {
      return undefined;
    }
  },

  async create(input: RecompensaInput): Promise<Recompensa> {
    const created = await api.post<ApiReward>("/rewards", recompensaToApi(input));
    return recompensaFromApi(created);
  },

  async update(id: string, input: RecompensaInput): Promise<Recompensa> {
    const updated = await api.patch<ApiReward>(
      `/rewards/${id}`,
      recompensaToApi(input),
    );
    return recompensaFromApi(updated);
  },

  async setEstat(id: string, estat: Recompensa["estat"]): Promise<void> {
    await api.patch(`/rewards/${id}`, { status: recompensaEstatToApi(estat) });
  },

  async remove(id: string): Promise<void> {
    await api.patch(`/rewards/${id}`, { status: "inactive" });
  },

  async getComercosOptions() {
    const shops = await api.get<ApiShop[]>("/shops");
    return shops.map((s) => ({ id: s.id, nom: s.name }));
  },
};
