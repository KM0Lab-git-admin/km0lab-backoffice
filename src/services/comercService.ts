import { api } from "@/lib/apiClient";
import { comercMeFromShop } from "@/lib/mappers/shop";
import type { ComercMe } from "@/types/comerc";
import type { ApiShop } from "@/types/api";

export const comercService = {
  async getMe(): Promise<ComercMe> {
    const shop = await api.get<ApiShop>("/shops/me");
    return comercMeFromShop(shop);
  },
};
