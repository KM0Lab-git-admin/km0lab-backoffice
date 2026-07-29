import { api } from "@/lib/apiClient";
import {
  promocioFromApi,
  promocioToCreate,
  promocioToUpdate,
} from "@/lib/mappers/promocio";
import type { Promocio, PromocioInput, PromoTipus } from "@/types/merchant";
import type { ApiPromotion } from "@/types/api";

export const promocionsService = {
  async list(): Promise<Promocio[]> {
    const rows = await api.get<ApiPromotion[]>("/promotions");
    return rows.map(promocioFromApi);
  },

  async create(input: PromocioInput): Promise<Promocio> {
    const created = await api.post<ApiPromotion>(
      "/promotions",
      promocioToCreate(input),
    );
    return promocioFromApi(created);
  },

  async update(id: string, input: PromocioInput): Promise<Promocio> {
    const updated = await api.patch<ApiPromotion>(
      `/promotions/${id}`,
      promocioToUpdate(input),
    );
    return promocioFromApi(updated);
  },

  async toggle(id: string, activa: boolean): Promise<void> {
    await api.patch(`/promotions/${id}`, { active: activa });
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/promotions/${id}`);
  },
};

export const promoTipusList: PromoTipus[] = [
  "descompte",
  "dos_x_un",
  "regal",
  "preu_especial",
];
