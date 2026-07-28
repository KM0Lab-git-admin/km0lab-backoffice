import { api } from "@/lib/apiClient";
import {
  bescanviFromApi,
  bescanviEstatToApi,
  recompensaFromApi,
} from "@/lib/mappers/admin";
import type {
  Bescanvi,
  BescanviEstat,
  BescanviFiltres,
  RecompensaTipus,
} from "@/types/backoffice";
import type { ApiRedemption, ApiResident, ApiReward, ApiShop } from "@/types/api";

function matches(b: Bescanvi, f: BescanviFiltres | undefined): boolean {
  if (!f) return true;
  if (f.query) {
    const q = f.query.trim().toLowerCase();
    if (q && !b.usuariNom.toLowerCase().includes(q)) return false;
  }
  if (f.tipus && f.tipus !== "tots" && b.recompensaTipus !== f.tipus) return false;
  if (f.estat && f.estat !== "tots" && b.estat !== f.estat) return false;
  if (f.comercId && f.comercId !== "tots" && b.comercId !== f.comercId) return false;
  if (f.pagament && f.pagament !== "tots") {
    const aplica = b.flux === "val_qr" && b.estat === "utilitzat";
    if (f.pagament === "no_aplica" && aplica) return false;
    if (f.pagament === "pendent" && (!aplica || b.pagamentEstat !== "pendent"))
      return false;
    if (f.pagament === "pagat" && (!aplica || b.pagamentEstat !== "pagat"))
      return false;
  }
  if (f.desde && b.dataSolicitud < f.desde) return false;
  if (f.fins && b.dataSolicitud > f.fins) return false;
  return true;
}

async function enrichRedemptions(
  rows: ApiRedemption[],
): Promise<Bescanvi[]> {
  const [residents, rewards, shops] = await Promise.all([
    api.get<ApiResident[]>("/residents").catch(() => [] as ApiResident[]),
    api.get<ApiReward[]>("/rewards").catch(() => [] as ApiReward[]),
    api.get<ApiShop[]>("/shops").catch(() => [] as ApiShop[]),
  ]);
  const residentsById = new Map(residents.map((r) => [r.id, r]));
  const rewardsById = new Map(rewards.map((r) => [r.id, r]));
  const shopsById = new Map(shops.map((s) => [s.id, s]));

  return rows.map((r) => {
    const user = residentsById.get(r.user_id);
    const reward = rewardsById.get(r.reward_id);
    const shop = r.shop_id ? shopsById.get(r.shop_id) : undefined;
    const mappedReward = reward ? recompensaFromApi(reward) : undefined;
    return bescanviFromApi(r, {
      usuariNom:
        user?.name ??
        ([user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
          undefined),
      recompensaNom: reward?.name,
      recompensaTipus: mappedReward?.tipus as RecompensaTipus | undefined,
      comercNom: shop?.name,
    });
  });
}

export const bescanvisService = {
  async list(filtres?: BescanviFiltres): Promise<Bescanvi[]> {
    const rows = await api.get<ApiRedemption[]>("/redemptions");
    const mapped = await enrichRedemptions(rows);
    return mapped
      .filter((b) => matches(b, filtres))
      .sort((a, b) => b.dataSolicitud.localeCompare(a.dataSolicitud));
  },

  async get(id: string): Promise<Bescanvi | undefined> {
    const rows = await api.get<ApiRedemption[]>("/redemptions");
    const found = rows.find((r) => r.id === id);
    if (!found) return undefined;
    const [mapped] = await enrichRedemptions([found]);
    return mapped;
  },

  async updateEstat(id: string, estat: BescanviEstat, nota?: string): Promise<void> {
    await api.patch(`/redemptions/${id}/status`, {
      status: bescanviEstatToApi(estat),
      note: nota ?? null,
    });
  },

  async cancel(id: string, nota?: string): Promise<void> {
    await api.patch(`/redemptions/${id}/status`, {
      status: "cancelled",
      note: nota ?? null,
    });
  },
};
