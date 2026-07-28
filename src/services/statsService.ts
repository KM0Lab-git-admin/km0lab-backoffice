import {
  statsHeatmapFixture,
  statsKPIFixture,
  statsPromosFixture,
  statsSerieFixture,
  statsVisitantsFixture,
} from "@/data/fixtures/stats";
import type {
  StatsHeatmapCel,
  StatsKPI,
  StatsPromoRendiment,
  StatsRang,
  StatsSeriePunt,
  StatsVisitant,
} from "@/types/comerc";

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function rangDies(rang: StatsRang): number {
  switch (rang) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "any":
      return 365;
  }
}

function scale(base: number, factor: number): number {
  return Math.round(base * factor);
}

export const statsService = {
  async getKPIs(rang: StatsRang): Promise<StatsKPI> {
    await wait();
    const f = rangDies(rang) / 30;
    const k = statsKPIFixture;
    return {
      escanejosTotals: scale(k.escanejosTotals, f),
      escanejosDeltaPct: k.escanejosDeltaPct,
      visitantsUnics: scale(k.visitantsUnics, f),
      visitantsUnicsDeltaPct: k.visitantsUnicsDeltaPct,
      nousVisitants: scale(k.nousVisitants, f),
      recurrents: scale(k.recurrents, f),
      puntsAtorgats: scale(k.puntsAtorgats, f),
      puntsAtorgatsDeltaPct: k.puntsAtorgatsDeltaPct,
    };
  },

  async getSerie(rang: StatsRang): Promise<StatsSeriePunt[]> {
    await wait();
    const dies = rangDies(rang);
    if (dies <= 30) return statsSerieFixture.slice(-dies);
    // Extend by tiling deterministically
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
    await wait();
    return [...statsPromosFixture].sort((a, b) => b.vistes - a.vistes);
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
