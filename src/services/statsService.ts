import { api } from "@/lib/apiClient";
import type {
  StatsHeatmapCel,
  StatsKPI,
  StatsPromoRendiment,
  StatsRang,
  StatsSeriePunt,
  StatsVisitant,
} from "@/types/comerc";
import type { ApiMerchantStats, ApiPromotion } from "@/types/api";
import {
  statsHeatmapFixture,
  statsSerieFixture,
  statsVisitantsFixture,
} from "@/data/fixtures/stats";

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const statsService = {
  async getKPIs(_rang: StatsRang): Promise<StatsKPI> {
    const s = await api.get<ApiMerchantStats>("/stats/merchant");
    return {
      escanejosTotals: s.total_scans,
      escanejosDeltaPct: 0,
      visitantsUnics: s.unique_visitors,
      visitantsUnicsDeltaPct: 0,
      nousVisitants: 0,
      recurrents: Math.max(0, s.unique_visitors),
      puntsAtorgats: s.points_awarded,
      puntsAtorgatsDeltaPct: 0,
    };
  },

  async getSerie(rang: StatsRang): Promise<StatsSeriePunt[]> {
    await wait();
    // Series endpoint not available yet — keep local fixture scaled by range.
    const dies = rang === "7d" ? 7 : rang === "30d" ? 30 : rang === "90d" ? 90 : 365;
    if (dies <= 30) return statsSerieFixture.slice(-dies);
    const out: StatsSeriePunt[] = [];
    for (let i = 0; i < dies; i++) {
      const src = statsSerieFixture[i % statsSerieFixture.length];
      const d = new Date();
      d.setDate(d.getDate() - (dies - 1 - i));
      out.push({
        data: d.toISOString().slice(0, 10),
        escanejos: src.escanejos,
        visitantsUnics: src.visitantsUnics,
      });
    }
    return out;
  },

  async getPromos(): Promise<StatsPromoRendiment[]> {
    const promos = await api.get<ApiPromotion[]>("/promotions");
    return promos.map((p) => ({
      promocioId: p.id,
      titol: p.title,
      etiqueta: p.label,
      activa: p.active,
      vistes: 0,
      obertes: 0,
      ratioConversio: 0,
    }));
  },

  async getHeatmap(): Promise<StatsHeatmapCel[]> {
    await wait();
    return statsHeatmapFixture;
  },

  async getVisitants(): Promise<StatsVisitant[]> {
    await wait();
    return statsVisitantsFixture;
  },
};
