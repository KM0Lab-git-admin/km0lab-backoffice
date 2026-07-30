export type PromoTipus = "descompte" | "dos_x_un" | "regal" | "preu_especial";

export type Promocio = {
  id: string;
  tipus: PromoTipus;
  etiqueta: string;
  titol: string;
  detall: string;
  titolI18n?: import("@/types/i18n").I18nMap;
  detallI18n?: import("@/types/i18n").I18nMap;
  idiomaOrigen?: import("@/types/i18n").Lang;
  valor?: string;
  compraMinima?: string;
  vigenciaInici?: string;
  vigenciaFi?: string;
  condicio?: string;
  activa: boolean;
};

export type ComercMe = {
  id: string;
  nom: string;
  emoji?: string;
  adherit: true;
};

export type ComercQR = {
  comercId: string;
  codi: string;
  puntsPerVisita: number;
  pngUrl?: string;
  pdfUrl?: string;
};

export type QRMetrics = {
  visites: number;
  puntsAtorgats: number;
  nousVisitantsSetmana: number;
};

export type PromocioInput = Omit<Promocio, "id" | "etiqueta"> & {
  etiqueta?: string;
};

export type DiaSetmana =
  | "dilluns"
  | "dimarts"
  | "dimecres"
  | "dijous"
  | "divendres"
  | "dissabte"
  | "diumenge";

export type HorariDia = {
  tancat: boolean;
  obertura: string; // "HH:mm"
  tancament: string; // "HH:mm"
};

export type Horari = Record<DiaSetmana, HorariDia>;

export type ComercFitxa = {
  id: string;
  nom: string;
  categories: string[]; // e.g. ["Alimentació", "Fleca"]
  descripcio: string; // copy shown in the app
  descripcioI18n?: import("@/types/i18n").I18nMap;
  idiomaOrigen?: import("@/types/i18n").Lang;
  logoUrl?: string; // small logo (list/summary)
  heroUrl?: string; // large image at the top
  adreca: string;
  codiPostal: string;
  poblacio: string;
  telefon: string;
  web: string;
  horari: Horari;
};

export type ComercFitxaInput = Omit<ComercFitxa, "id">;

// Statistics
export type StatsRang = "7d" | "30d" | "90d" | "any";

export type StatsKPI = {
  escanejosTotals: number;
  escanejosDeltaPct: number; // vs previous period
  visitantsUnics: number;
  visitantsUnicsDeltaPct: number;
  nousVisitants: number;
  recurrents: number;
  puntsAtorgats: number;
  puntsAtorgatsDeltaPct: number;
};

export type StatsSeriePunt = {
  data: string; // ISO date
  escanejos: number;
  visitantsUnics: number;
};

export type StatsPromoRendiment = {
  promocioId: string;
  titol: string;
  etiqueta: string;
  activa: boolean;
  vistes: number;
  obertes: number;
  ratioConversio: number; // 0..1
};

export type StatsHeatmapCel = {
  dia: number; // 0..6 (dilluns..diumenge)
  hora: number; // 0..23
  escanejos: number;
};

export type StatsVisitant = {
  id: string;
  nom: string;
  visites: number;
  ultimaVisita: string; // ISO
  puntsAcumulats: number;
  contacteCompartit: boolean;
  email?: string;
  telefon?: string;
};
