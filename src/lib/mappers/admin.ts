import type {
  AccioPunts,
  AccioPuntsInput,
  AccioPuntsTipus,
  AccioTipus,
  AccioTop,
  AdminMe,
  AdminResumStats,
  Bescanvi,
  BescanviEstat,
  BescanviFlux,
  BescanviHist,
  BescanviResum,
  ComercAdmin,
  ComercAdminInput,
  ComercEstat,
  EntitatTipus,
  PoblacioConfig,
  PoblacioConfigInput,
  Recompensa,
  RecompensaEstat,
  RecompensaInput,
  RecompensaTipus,
  VeiActivitat,
  VeiActivitatTipus,
  VeiPrograma,
} from "@/types/backoffice";
import { absoluteMediaUrl } from "@/lib/apiClient";
import { categoriesFromApi, categoriesToApi } from "@/lib/mappers/categories";
import type {
  ApiAdminStats,
  ApiPointAction,
  ApiRedemption,
  ApiResident,
  ApiReward,
  ApiShop,
  ApiTown,
  ApiUser,
} from "@/types/api";

// —— Accions ——

const ACCIO_TIPUS_TO_API: Record<AccioPuntsTipus, string> = {
  registre: "signup",
  aniversari: "birthday",
  escaneig_qr: "qr_scan",
  visita_web: "web_visit",
  registre_web: "web_signup",
  esdeveniment: "event",
  personalitzada: "custom",
};

const ACCIO_TIPUS_FROM_API: Record<string, AccioPuntsTipus> = {
  signup: "registre",
  birthday: "aniversari",
  qr_scan: "escaneig_qr",
  web_visit: "visita_web",
  web_signup: "registre_web",
  event: "esdeveniment",
  custom: "personalitzada",
};

const ACCIO_TOP_TIPUS: Record<string, AccioTipus> = {
  signup: "registre",
  birthday: "altre",
  qr_scan: "escaneig",
  web_visit: "web",
  web_signup: "web",
  event: "esdeveniment",
  custom: "altre",
};

function isoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return value.slice(0, 10);
}

function toIsoDateTime(value: string | undefined): string | null {
  if (!value) return null;
  if (value.includes("T")) return value;
  return `${value}T00:00:00Z`;
}

export function accioFromApi(a: ApiPointAction): AccioPunts {
  return {
    id: a.id,
    poblacioId: a.town_id,
    tipus: ACCIO_TIPUS_FROM_API[a.type] ?? "personalitzada",
    nom: a.name,
    descripcio: a.description,
    punts: a.points,
    limitPerUsuari: a.per_user_limit ?? undefined,
    limitTotal: a.total_limit ?? undefined,
    vigenciaInici: isoDate(a.valid_from),
    vigenciaFi: isoDate(a.valid_until),
    condicions: a.conditions ?? undefined,
    activa: a.active,
    url: a.url ?? undefined,
    esdevenimentId: a.event_id ?? undefined,
    comercId: a.shop_id ?? undefined,
    cooldownDies: a.cooldown_days ?? undefined,
  };
}

export function accioToApi(input: AccioPuntsInput): Record<string, unknown> {
  return {
    type: ACCIO_TIPUS_TO_API[input.tipus],
    name: input.nom,
    description: input.descripcio ?? "",
    points: input.punts,
    per_user_limit: input.limitPerUsuari ?? null,
    total_limit: input.limitTotal ?? null,
    valid_from: toIsoDateTime(input.vigenciaInici),
    valid_until: toIsoDateTime(input.vigenciaFi),
    conditions: input.condicions ?? null,
    active: input.activa,
    url: input.url ?? null,
    event_id: input.esdevenimentId ?? null,
    shop_id: input.comercId ?? null,
    cooldown_days:
      input.tipus === "escaneig_qr" ? (input.cooldownDies ?? null) : null,
  };
}

export function accioTopFromApi(a: ApiPointAction): AccioTop {
  return {
    id: a.id,
    nom: a.name,
    tipus: ACCIO_TOP_TIPUS[a.type] ?? "altre",
    punts: a.points,
    usos: 0,
    emoji: "⚡",
  };
}

// —— Recompenses ——

const RECOMPENSA_TIPUS_TO_API: Record<RecompensaTipus, string> = {
  descompte: "discount",
  saldo: "balance",
  producte: "product",
  servei: "service",
  marxandatge: "merchandise",
  experiencia: "experience",
};

const RECOMPENSA_TIPUS_FROM_API: Record<string, RecompensaTipus> = {
  discount: "descompte",
  balance: "saldo",
  product: "producte",
  service: "servei",
  merchandise: "marxandatge",
  experience: "experiencia",
};

const RECOMPENSA_ESTAT_TO_API: Record<RecompensaEstat, string> = {
  activa: "active",
  inactiva: "inactive",
  esgotada: "sold_out",
};

const RECOMPENSA_ESTAT_FROM_API: Record<string, RecompensaEstat> = {
  active: "activa",
  inactive: "inactiva",
  sold_out: "esgotada",
};

export function recompensaFromApi(r: ApiReward): Recompensa {
  return {
    id: r.id,
    poblacioId: r.town_id,
    nom: r.name,
    descripcio: r.description,
    imatgeUrl: absoluteMediaUrl(r.image_url) ?? undefined,
    tipus: RECOMPENSA_TIPUS_FROM_API[r.type] ?? "producte",
    puntsNecessaris: r.points_required,
    valor: r.value ?? undefined,
    comercos: r.shop_ids.length === 0 ? "tots" : r.shop_ids,
    estoc: r.stock ?? undefined,
    dataInici: isoDate(r.valid_from),
    dataFi: isoDate(r.valid_until),
    condicions: r.conditions ?? undefined,
    estat: RECOMPENSA_ESTAT_FROM_API[r.status] ?? "inactiva",
  };
}

export function recompensaToApi(input: RecompensaInput): Record<string, unknown> {
  return {
    name: input.nom,
    description: input.descripcio ?? "",
    // Image via PUT /rewards/{id}/media — do not send data URLs in image_url
    type: RECOMPENSA_TIPUS_TO_API[input.tipus],
    points_required: input.puntsNecessaris,
    value: input.valor ?? null,
    stock: input.estoc ?? null,
    valid_from: toIsoDateTime(input.dataInici),
    valid_until: toIsoDateTime(input.dataFi),
    conditions: input.condicions ?? null,
    status: RECOMPENSA_ESTAT_TO_API[input.estat],
    shop_ids: input.comercos === "tots" ? [] : input.comercos,
  };
}

export function recompensaEstatToApi(estat: RecompensaEstat): string {
  return RECOMPENSA_ESTAT_TO_API[estat];
}

// —— Comerços admin ——

const ESTAT_TO_API: Record<ComercEstat, string> = {
  actiu: "active",
  inactiu: "inactive",
};

const ESTAT_FROM_API: Record<string, ComercEstat> = {
  active: "actiu",
  pending: "inactiu",
  inactive: "inactiu",
};

export function comercAdminFromShop(
  shop: ApiShop,
  nPromocionsActives = 0,
): ComercAdmin {
  return {
    id: shop.id,
    poblacioId: shop.town_id,
    nom: shop.name,
    emoji: shop.emoji ?? undefined,
    logoUrl: absoluteMediaUrl(shop.logo_url),
    categories: categoriesFromApi(shop.categories ?? []),
    emailContacte: shop.contact_email,
    puntsPerVisita: shop.visit_points,
    adreca: shop.address ?? undefined,
    estat: ESTAT_FROM_API[shop.status] ?? "inactiu",
    qrGenerat: Boolean(shop.qr_code),
    nPromocionsActives,
    dataAlta: shop.created_at,
  };
}

export function comercAdminToCreate(input: ComercAdminInput): Record<string, unknown> {
  return {
    name: input.nom,
    emoji: input.emoji ?? null,
    categories: categoriesToApi(input.categories),
    contact_email: input.emailContacte,
    visit_points: input.puntsPerVisita,
    address: input.adreca ?? null,
  };
}

export function comercAdminToUpdate(input: ComercAdminInput): Record<string, unknown> {
  return comercAdminToCreate(input);
}

export function comercEstatToApi(estat: ComercEstat): string {
  return ESTAT_TO_API[estat];
}

// —— Usuaris / residents ——

const ACTIVITAT_TIPUS: Record<string, VeiActivitatTipus> = {
  qr_scan: "escaneig",
  scan: "escaneig",
  action: "accio",
  point_action: "accio",
  redemption: "bescanvi",
  welcome: "accio",
};

export function veiFromResident(r: ApiResident): VeiPrograma {
  const activity: VeiActivitat[] = (r.activity ?? []).map((a) => ({
    id: a.id,
    tipus: ACTIVITAT_TIPUS[a.type] ?? "accio",
    descripcio: a.description ?? a.type,
    data: a.created_at,
    punts: a.points,
  }));
  const last = activity[0]?.data ?? r.created_at;
  const escanejos = activity.filter((a) => a.tipus === "escaneig").length;
  const bescanvis = activity.filter((a) => a.tipus === "bescanvi").length;
  return {
    id: r.id,
    poblacioId: r.town_id ?? "",
    nom:
      r.name ??
      ([r.first_name, r.last_name].filter(Boolean).join(" ") || r.slug),
    puntsAcumulats: r.points,
    nivell: Math.max(1, Math.floor(r.points / 500) + 1),
    escanejos,
    comercosVisitats: 0,
    bescanvis,
    dataAlta: r.created_at,
    ultimaActivitat: last,
    contacteCompartit: r.contact_shared,
    email: r.email ?? undefined,
    telefon: r.phone ?? undefined,
    activitat: activity,
  };
}

// —— Bescanvis / redemptions ——

const FLUX_FROM_API: Record<string, BescanviFlux> = {
  voucher_qr: "val_qr",
  delivery: "lliurament",
};

const ESTAT_BESCANVI_FROM_API: Record<string, BescanviEstat> = {
  pending_use: "pendent_us",
  used: "utilitzat",
  requested: "solicitat",
  pending_preparation: "pendent_preparacio",
  prepared: "preparat",
  pending_pickup: "pendent_recollida",
  delivered: "entregat",
  cancelled: "cancel·lat",
};

const ESTAT_BESCANVI_TO_API: Record<BescanviEstat, string> = {
  pendent_us: "pending_use",
  utilitzat: "used",
  solicitat: "requested",
  pendent_preparacio: "pending_preparation",
  preparat: "prepared",
  pendent_recollida: "pending_pickup",
  entregat: "delivered",
  "cancel·lat": "cancelled",
};

export function bescanviEstatToApi(estat: BescanviEstat): string {
  return ESTAT_BESCANVI_TO_API[estat];
}

export function bescanviFromApi(
  r: ApiRedemption,
  opts?: {
    usuariNom?: string;
    recompensaNom?: string;
    recompensaTipus?: RecompensaTipus;
    comercNom?: string;
  },
): Bescanvi {
  const flux = FLUX_FROM_API[r.flow] ?? "lliurament";
  const tipus = opts?.recompensaTipus ?? "producte";
  const historial: BescanviHist[] = (r.events ?? []).map((e) => ({
    estat: ESTAT_BESCANVI_FROM_API[e.status] ?? "solicitat",
    data: e.created_at,
    nota: e.note ?? undefined,
  }));
  return {
    id: r.id,
    poblacioId: r.town_id,
    usuariId: r.user_id,
    usuariNom: opts?.usuariNom ?? r.user_id.slice(0, 8),
    recompensaId: r.reward_id,
    recompensaNom: opts?.recompensaNom ?? r.reward_id.slice(0, 8),
    recompensaTipus: tipus,
    flux,
    puntsDescomptats: r.points_spent,
    dataSolicitud: r.requested_at,
    estat: ESTAT_BESCANVI_FROM_API[r.status] ?? "solicitat",
    import: r.amount ?? undefined,
    qrGenerat: flux === "val_qr",
    codi: r.id.slice(-5).toUpperCase(),
    comercId: r.shop_id ?? undefined,
    comercNom: opts?.comercNom,
    dataUs: r.used_at ?? undefined,
    importAplicat: r.amount_applied ?? undefined,
    importPagatNum: r.amount_applied
      ? Number.parseFloat(r.amount_applied.replace(",", ".")) || undefined
      : undefined,
    pagamentEstat: flux === "val_qr" && r.status === "used" ? "pendent" : undefined,
    dataLliurament: r.delivered_at ?? undefined,
    historial,
  };
}

export function bescanviResumFromApi(
  r: ApiRedemption,
  opts?: { usuariNom?: string; recompensaNom?: string },
): BescanviResum {
  return {
    id: r.id,
    recompensaNom: opts?.recompensaNom ?? r.reward_id.slice(0, 8),
    usuari: opts?.usuariNom ?? r.user_id.slice(0, 8),
    quan: r.requested_at,
    punts: r.points_spent,
    emoji: "🎁",
  };
}

// —— Admin me / stats / town config ——

export function adminMeFromUser(user: ApiUser, town?: ApiTown | null): AdminMe {
  return {
    id: user.id,
    poblacioId: user.town_id ?? town?.id ?? "",
    poblacioNom: user.town_name ?? town?.name ?? "",
    nom: user.name ?? user.email,
  };
}

export function adminStatsFromApi(s: ApiAdminStats): AdminResumStats {
  return {
    usuarisActius: s.active_users,
    puntsCirculacio: s.points_in_circulation,
    bescanvisMes: s.redemptions_this_month,
    accionsActives: s.active_actions,
    accionsTotals: s.total_actions,
  };
}

const ENTITAT_FROM_API: Record<string, EntitatTipus> = {
  city_council: "ajuntament",
  private: "privada",
};

const ENTITAT_TO_API: Record<EntitatTipus, string> = {
  ajuntament: "city_council",
  privada: "private",
};

export function configFromTown(town: ApiTown): PoblacioConfig {
  return {
    poblacioId: town.id,
    poblacioNom: town.name,
    entitatNom: town.entity_name,
    entitatTipus: ENTITAT_FROM_API[town.entity_type] ?? "ajuntament",
    contacteEmail: town.contact_email,
    responsable: town.manager_name,
    logoUrl: town.logo_url ?? undefined,
    puntsPerEuro: 200,
    caducitatMesos: town.expiry_months ?? undefined,
    idiomaDefecte: "ca",
  };
}

export function configToTownUpdate(
  input: PoblacioConfigInput,
): Record<string, unknown> {
  return {
    entity_name: input.entitatNom,
    entity_type: ENTITAT_TO_API[input.entitatTipus],
    contact_email: input.contacteEmail,
    manager_name: input.responsable,
    logo_url: input.logoUrl ?? null,
    expiry_months: input.caducitatMesos ?? null,
  };
}
