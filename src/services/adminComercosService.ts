import { api } from "@/lib/apiClient";
import {
  comercAdminFromShop,
  comercAdminToCreate,
  comercAdminToUpdate,
  comercEstatToApi,
} from "@/lib/mappers/admin";
import type { ComercAdmin, ComercAdminInput, ComercEstat } from "@/types/backoffice";
import type { ApiShop } from "@/types/api";

export const adminComercosService = {
  async list(): Promise<ComercAdmin[]> {
    const shops = await api.get<ApiShop[]>("/shops");
    // /promotions is merchant-scoped; admin list shows 0 until a dedicated count exists.
    return shops.map((s) => comercAdminFromShop(s, 0));
  },

  async get(id: string): Promise<ComercAdmin | undefined> {
    try {
      const shop = await api.get<ApiShop>(`/shops/${id}`);
      return comercAdminFromShop(shop, 0);
    } catch {
      return undefined;
    }
  },

  async create(input: ComercAdminInput): Promise<ComercAdmin> {
    const shop = await api.post<ApiShop>("/shops", comercAdminToCreate(input));
    return comercAdminFromShop(shop, 0);
  },

  async update(id: string, input: ComercAdminInput): Promise<ComercAdmin> {
    const shop = await api.patch<ApiShop>(
      `/shops/${id}`,
      comercAdminToUpdate(input),
    );
    return comercAdminFromShop(shop, 0);
  },

  async setEstat(id: string, estat: ComercEstat): Promise<void> {
    await api.patch(`/shops/${id}`, { status: comercEstatToApi(estat) });
  },

  async remove(id: string): Promise<void> {
    // No DELETE endpoint — soft-deactivate.
    await api.patch(`/shops/${id}`, { status: "inactive" });
  },
};
