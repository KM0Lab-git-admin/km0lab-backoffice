import { api } from "@/lib/apiClient";
import { deuteFromApi, pagamentFromApi } from "@/lib/mappers/admin";
import { bescanvisService } from "@/services/bescanvisService";
import type { ApiShopDebt, ApiShopPayment } from "@/types/api";
import type {
  Bescanvi,
  DeuteComerc,
  PagamentComerc,
} from "@/types/backoffice";

export const pagamentsService = {
  async listDeutes(): Promise<DeuteComerc[]> {
    const rows = await api.get<ApiShopDebt[]>("/payments/debts");
    return rows.map(deuteFromApi);
  },

  /** Used vouchers of a shop still pending settlement. */
  async listBescanvisPendents(comercId: string): Promise<Bescanvi[]> {
    const bescanvis = await bescanvisService.list();
    return bescanvis
      .filter(
        (b) =>
          b.flux === "val_qr" &&
          b.estat === "utilitzat" &&
          b.comercId === comercId &&
          b.pagamentEstat === "pendent",
      )
      .sort((a, b) => (a.dataUs ?? "").localeCompare(b.dataUs ?? ""));
  },

  async listPagamentsComerc(comercId: string): Promise<PagamentComerc[]> {
    const rows = await api.get<ApiShopPayment[]>(
      `/payments?shop_id=${encodeURIComponent(comercId)}`,
    );
    return rows.map(pagamentFromApi);
  },

  async list(): Promise<PagamentComerc[]> {
    const rows = await api.get<ApiShopPayment[]>("/payments");
    return rows.map(pagamentFromApi);
  },

  async registrar(input: {
    comercId: string;
    comercNom: string;
    bescanviIds: string[];
    nota?: string;
  }): Promise<PagamentComerc> {
    const created = await api.post<ApiShopPayment>("/payments", {
      shop_id: input.comercId,
      redemption_ids: input.bescanviIds,
      note: input.nota ?? null,
    });
    return pagamentFromApi(created);
  },
};
