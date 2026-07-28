import { api } from "@/lib/apiClient";
import { bescanviFromApi, recompensaFromApi } from "@/lib/mappers/admin";
import { useSessionStore } from "@/stores/useSessionStore";
import type { Bescanvi, RecompensaTipus } from "@/types/backoffice";
import type { ApiRedemption, ApiResident, ApiReward, ApiShop } from "@/types/api";

export type ValidarResult =
  | { ok: true; bescanvi: Bescanvi }
  | {
      ok: false;
      motiu: "no_trobat" | "ja_utilitzat" | "cancelat";
      bescanvi?: Bescanvi;
    };

export type ValsFiltres = {
  query?: string;
  cobrament?: "tots" | "pendent" | "pagat";
};

export type ResumCobrament = {
  nMes: number;
  importPendent: number;
  importCobrat: number;
};

async function enrichOne(r: ApiRedemption): Promise<Bescanvi> {
  const [residents, rewards, myShop] = await Promise.all([
    api.get<ApiResident[]>("/residents").catch(() => [] as ApiResident[]),
    api.get<ApiReward[]>("/rewards").catch(() => [] as ApiReward[]),
    api.get<ApiShop>("/shops/me").catch(() => null),
  ]);
  const user = residents.find((u) => u.id === r.user_id);
  const reward = rewards.find((rw) => rw.id === r.reward_id);
  const shopName =
    myShop && r.shop_id === myShop.id
      ? myShop.name
      : undefined;
  return bescanviFromApi(r, {
    usuariNom:
      user?.name ??
      ([user?.first_name, user?.last_name].filter(Boolean).join(" ") || undefined),
    recompensaNom: reward?.name,
    recompensaTipus: reward
      ? (recompensaFromApi(reward).tipus as RecompensaTipus)
      : undefined,
    comercNom: shopName,
  });
}

function currentComercId(): string {
  return useSessionStore.getState().comercId ?? "";
}

export const valsComercService = {
  async validarCodi(codiRaw: string): Promise<ValidarResult> {
    const codi = codiRaw.trim();
    const rows = await api.get<ApiRedemption[]>("/redemptions");
    const match = rows.find(
      (b) =>
        b.flow === "voucher_qr" &&
        (b.id === codi ||
          b.id.endsWith(codi) ||
          b.id.slice(-5).toUpperCase() === codi.toUpperCase()),
    );
    if (!match) return { ok: false, motiu: "no_trobat" };
    if (match.status === "cancelled") {
      return { ok: false, motiu: "cancelat", bescanvi: await enrichOne(match) };
    }
    if (match.status === "used") {
      return {
        ok: false,
        motiu: "ja_utilitzat",
        bescanvi: await enrichOne(match),
      };
    }
    if (match.status !== "pending_use") {
      return { ok: false, motiu: "no_trobat", bescanvi: await enrichOne(match) };
    }
    const used = await api.post<ApiRedemption>(`/redemptions/${match.id}/use`, {});
    return { ok: true, bescanvi: await enrichOne(used) };
  },

  async list(filtres?: ValsFiltres): Promise<Bescanvi[]> {
    const comercId = currentComercId();
    const rows = await api.get<ApiRedemption[]>("/redemptions");
    const q = filtres?.query?.trim().toLowerCase();
    const cobrament = filtres?.cobrament ?? "tots";
    const filtered = rows.filter((b) => {
      if (b.flow !== "voucher_qr") return false;
      if (b.status !== "used") return false;
      if (comercId && b.shop_id !== comercId) return false;
      if (q) {
        const ref = b.id.toLowerCase();
        const codi = b.id.slice(-5).toLowerCase();
        if (!ref.includes(q) && !codi.includes(q)) return false;
      }
      return true;
    });
    const mapped = await Promise.all(filtered.map(enrichOne));
    return mapped
      .filter((b) => {
        if (cobrament === "pendent" && b.pagamentEstat !== "pendent") return false;
        if (cobrament === "pagat" && b.pagamentEstat !== "pagat") return false;
        return true;
      })
      .sort((a, b) => (b.dataUs ?? "").localeCompare(a.dataUs ?? ""));
  },

  async resum(): Promise<ResumCobrament> {
    const list = await valsComercService.list({ cobrament: "tots" });
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    let nMes = 0;
    let importPendent = 0;
    let importCobrat = 0;
    for (const b of list) {
      const imp = b.importPagatNum ?? 0;
      if ((b.dataUs ?? "") >= monthStart) nMes += 1;
      if (b.pagamentEstat === "pagat") importCobrat += imp;
      else importPendent += imp;
    }
    return { nMes, importPendent, importCobrat };
  },
};
