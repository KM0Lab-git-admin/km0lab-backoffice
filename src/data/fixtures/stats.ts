import type {
  StatsHeatmapCel,
  StatsKPI,
  StatsPromoRendiment,
  StatsSeriePunt,
  StatsVisitant,
} from "@/types/comerc";

export const statsKPIFixture: StatsKPI = {
  escanejosTotals: 428,
  escanejosDeltaPct: 12.4,
  visitantsUnics: 187,
  visitantsUnicsDeltaPct: 8.1,
  nousVisitants: 54,
  recurrents: 133,
  puntsAtorgats: 8560,
  puntsAtorgatsDeltaPct: 12.4,
};

// 30 days series (deterministic)
export const statsSerieFixture: StatsSeriePunt[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 8 + Math.round(6 * Math.sin(i / 3.2));
  const jitter = ((i * 7) % 5) - 2;
  const escanejos = Math.max(2, base + jitter + (i % 7 === 5 ? 8 : 0));
  const visitantsUnics = Math.max(1, Math.round(escanejos * 0.72));
  return {
    data: d.toISOString().slice(0, 10),
    escanejos,
    visitantsUnics,
  };
});

export const statsPromosFixture: StatsPromoRendiment[] = [
  {
    promocioId: "p-1",
    titol: "5% de descompte",
    etiqueta: "-5%",
    activa: true,
    vistes: 312,
    obertes: 141,
    ratioConversio: 0.45,
  },
  {
    promocioId: "p-2",
    titol: "2×1 en cafès",
    etiqueta: "2×1",
    activa: true,
    vistes: 268,
    obertes: 173,
    ratioConversio: 0.65,
  },
  {
    promocioId: "p-3",
    titol: "15% de descompte",
    etiqueta: "-15%",
    activa: true,
    vistes: 205,
    obertes: 118,
    ratioConversio: 0.58,
  },
  {
    promocioId: "p-4",
    titol: "Croissant de regal",
    etiqueta: "Regal",
    activa: false,
    vistes: 92,
    obertes: 24,
    ratioConversio: 0.26,
  },
];

// Heatmap: 7 dies × 24 hores, valors deterministes
export const statsHeatmapFixture: StatsHeatmapCel[] = (() => {
  const cells: StatsHeatmapCel[] = [];
  for (let dia = 0; dia < 7; dia++) {
    for (let hora = 0; hora < 24; hora++) {
      let base = 0;
      if (hora >= 8 && hora <= 11) base = 6 + ((dia * 3 + hora) % 5);
      else if (hora >= 12 && hora <= 14) base = 4 + (hora % 3);
      else if (hora >= 17 && hora <= 20) base = 5 + ((dia + hora) % 4);
      else if (hora >= 7 && hora <= 21) base = 1 + (hora % 2);
      if (dia === 6) base = Math.max(0, base - 3); // diumenge
      cells.push({ dia, hora, escanejos: base });
    }
  }
  return cells;
})();

export const statsVisitantsFixture: StatsVisitant[] = [
  {
    id: "v-001",
    nom: "Marta Puig",
    visites: 12,
    ultimaVisita: new Date(Date.now() - 1 * 86400000).toISOString(),
    puntsAcumulats: 240,
    contacteCompartit: true,
    email: "marta.puig@example.cat",
    telefon: "612 34 56 78",
  },
  {
    id: "v-002",
    nom: "Jordi Riba",
    visites: 9,
    ultimaVisita: new Date(Date.now() - 2 * 86400000).toISOString(),
    puntsAcumulats: 180,
    contacteCompartit: true,
    email: "jordi.riba@example.cat",
    telefon: "622 11 22 33",
  },
  {
    id: "v-003",
    nom: "Anna Solé",
    visites: 7,
    ultimaVisita: new Date(Date.now() - 3 * 86400000).toISOString(),
    puntsAcumulats: 140,
    contacteCompartit: false,
  },
  {
    id: "v-004",
    nom: "Pere Vidal",
    visites: 6,
    ultimaVisita: new Date(Date.now() - 4 * 86400000).toISOString(),
    puntsAcumulats: 120,
    contacteCompartit: true,
    email: "pere.vidal@example.cat",
    telefon: "633 44 55 66",
  },
  {
    id: "v-005",
    nom: "Laia Bosch",
    visites: 5,
    ultimaVisita: new Date(Date.now() - 6 * 86400000).toISOString(),
    puntsAcumulats: 100,
    contacteCompartit: false,
  },
  {
    id: "v-006",
    nom: "Sergi Font",
    visites: 4,
    ultimaVisita: new Date(Date.now() - 8 * 86400000).toISOString(),
    puntsAcumulats: 80,
    contacteCompartit: true,
    email: "sergi.font@example.cat",
    telefon: "644 77 88 99",
  },
  {
    id: "v-007",
    nom: "Clara Ferrer",
    visites: 3,
    ultimaVisita: new Date(Date.now() - 10 * 86400000).toISOString(),
    puntsAcumulats: 60,
    contacteCompartit: false,
  },
  {
    id: "v-008",
    nom: "Marc Ollé",
    visites: 3,
    ultimaVisita: new Date(Date.now() - 12 * 86400000).toISOString(),
    puntsAcumulats: 60,
    contacteCompartit: true,
    email: "marc.olle@example.cat",
    telefon: "655 12 34 56",
  },
  {
    id: "v-009",
    nom: "Núria Camps",
    visites: 2,
    ultimaVisita: new Date(Date.now() - 15 * 86400000).toISOString(),
    puntsAcumulats: 40,
    contacteCompartit: false,
  },
  {
    id: "v-010",
    nom: "Oriol Mas",
    visites: 1,
    ultimaVisita: new Date(Date.now() - 20 * 86400000).toISOString(),
    puntsAcumulats: 20,
    contacteCompartit: true,
    email: "oriol.mas@example.cat",
    telefon: "666 98 76 54",
  },
];
