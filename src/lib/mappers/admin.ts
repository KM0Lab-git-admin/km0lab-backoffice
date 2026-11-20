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
  CooldownUnitat,
  ComercAdmin,
  ComercAdminInput,
  ComercEstat,
  DeuteComerc,
  EntitatTipus,
  IdiomaDefecte,
  PagamentComerc,
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
import { absoluteMediaUrl, cacheBustedMediaUrl } from "@/lib/apiClient";
import { categoriesFromApi, categoriesToApi } from "@/lib/mappers/categories";
import { normalizeLang, pickPlain, seedI18n } from "@/types/i18n";
import type {
  ApiAdminStats,
  ApiPointAction,
  ApiRedemption,
  ApiResident,
  ApiReward,
  ApiShop,
  ApiShopDebt,
  ApiShopPayment,
  ApiTown,
  ApiUser,
} from "@/types/api";

// —— Accions ——

const ACCIO_TIPUS_TO_API: Record<AccioPuntsTipus, string> = {
  registre: "signup",
  primer_escaneig: "first_scan",
  aniversari: "birthday",
  escaneig_qr: "qr_scan",
  visita_web: "web_visit",
  registre_web: "web_signup",
  esdeveniment: "event",
  personalitzada: "custom",
  invitacio_persona: "invite_person",
  invitacio_negoci: "invite_business",
};

const ACCIO_TIPUS_FROM_API: Record<string, AccioPuntsTipus> = {
  signup: "registre",
  first_scan: "primer_escaneig",
  birthday: "aniversari",
  qr_scan: "escaneig_qr",
  web_visit: "visita_web",
  web_signup: "registre_web",
  event: "esdeveniment",
  custom: "personalitzada",
  invite_person: "invitacio_persona",
  invite_business: "invitacio_negoci",
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

const COOLDOWN_FACTOR: Record<CooldownUnitat, number> = {
  dies: 1,
  setmanes: 7,
  mesos: 30,
};

/** cooldown_days (int) → { valor, unitat } amb preferència mesos > setmanes > dies. */
function cooldownDaysToValorUnitat(
  days: number | null | undefined,
): { cooldownValor: number; cooldownUnitat: CooldownUnitat } | undefined {
  if (!days || days <= 0) return undefined;
  if (days % 30 === 0) return { cooldownValor: days / 30, cooldownUnitat: "mesos" };
  if (days % 7 === 0) return { cooldownValor: days / 7, cooldownUnitat: "setmanes" };
  return { cooldownValor: days, cooldownUnitat: "dies" };
}

/** { valor, unitat } → cooldown_days (int). */
function cooldownValorUnitatToDays(
  valor: number | undefined,
  unitat: CooldownUnitat | undefined,
): number | null {
  if (!valor || !unitat) return null;
  const days = Math.round(valor * COOLDOWN_FACTOR[unitat]);
  return days > 0 ? days : null;
}

export function accioFromApi(a: ApiPointAction): AccioPunts {
  const cooldown = cooldownDaysToValorUnitat(a.cooldown_days);
  const idiomaOrigen = normalizeLang(a.i18n_source_lang);
  return {
    id: a.id,
    poblacioId: a.town_id,
    tipus: ACCIO_TIPUS_FROM_API[a.type] ?? "personalitzada",
    nom: a.name,
    descripcio: a.description,
    nomI18n: seedI18n(a.name, idiomaOrigen, a.name_i18n),
    descripcioI18n: seedI18n(a.description, idiomaOrigen, a.description_i18n),
    idiomaOrigen,
    punts: a.points,
    limitPerUsuari: a.per_user_limit ?? undefined,
    limitTotal: a.total_limit ?? undefined,
    vigenciaInici: isoDate(a.valid_from),
    vigenciaFi: isoDate(a.valid_until),
    condicions: a.conditions ?? undefined,
    activa: a.active,
    visibleAHome: a.visible_home ?? true,
    url: a.url ?? undefined,
    esdevenimentId: a.event_id ?? undefined,
    comercId: a.shop_id ?? undefined,
    cooldownValor: cooldown?.cooldownValor,
    cooldownUnitat: cooldown?.cooldownUnitat,
  };
}

export function accioToApi(input: AccioPuntsInput): Record<string, unknown> {
  const idiomaOrigen = normalizeLang(input.idiomaOrigen);
  const nomI18n = seedI18n(input.nom, idiomaOrigen, input.nomI18n);
  const descripcioI18n = seedI18n(
    input.descripcio,
    idiomaOrigen,
    input.descripcioI18n,
  );
  return {
    type: ACCIO_TIPUS_TO_API[input.tipus],
    name: pickPlain(nomI18n, idiomaOrigen, input.nom),
    description: pickPlain(descripcioI18n, idiomaOrigen, input.descripcio),
    name_i18n: nomI18n,
    description_i18n: descripcioI18n,
    i18n_source_lang: idiomaOrigen,
    points: input.punts,
    per_user_limit: input.limitPerUsuari ?? null,
    total_limit: input.limitTotal ?? null,
    valid_from: toIsoDateTime(input.vigenciaInici),
    valid_until: toIsoDateTime(input.vigenciaFi),
    conditions: input.condicions ?? null,
    active: input.activa,
    visible_home: input.visibleAHome ?? true,
    url: input.url ?? null,
    event_id: input.esdevenimentId ?? null,
    // shop_id removed from API (migration 0017); omit.
    cooldown_days:
      input.tipus === "escaneig_qr"
        ? cooldownValorUnitatToDays(input.cooldownValor, input.cooldownUnitat)
        : null,
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
  const idiomaOrigen = normalizeLang(r.i18n_source_lang);
  return {
    id: r.id,
    poblacioId: r.town_id,
    nom: r.name,
    descripcio: r.description,
    nomI18n: seedI18n(r.name, idiomaOrigen, r.name_i18n),
    descripcioI18n: seedI18n(r.description, idiomaOrigen, r.description_i18n),
    idiomaOrigen,
    imatgeUrl:
      r.has_image === false
        ? undefined
        : cacheBustedMediaUrl(r.image_url, r.updated_at) ?? undefined,
    tipus: RECOMPENSA_TIPUS_FROM_API[r.type] ?? "producte",
    puntsNecessaris: r.points_required,
    valor: r.value ?? undefined,
    comercos: r.shop_ids.length === 0 ? "tots" : r.shop_ids,
    estoc: r.stock ?? undefined,
    dataInici: isoDate(r.valid_from),
    dataFi: isoDate(r.valid_until),
    condicions: r.conditions ?? undefined,
    estat: RECOMPENSA_ESTAT_FROM_API[r.status] ?? "inactiva",
    contingutBloquejat: Boolean(r.content_locked),
  };
}

export function recompensaToApi(input: RecompensaInput): Record<string, unknown> {
  const idiomaOrigen = normalizeLang(input.idiomaOrigen);
  const nomI18n = seedI18n(input.nom, idiomaOrigen, input.nomI18n);
  const descripcioI18n = seedI18n(
    input.descripcio,
    idiomaOrigen,
    input.descripcioI18n,
  );
  return {
    name: pickPlain(nomI18n, idiomaOrigen, input.nom),
    description: pickPlain(descripcioI18n, idiomaOrigen, input.descripcio),
    name_i18n: nomI18n,
    description_i18n: descripcioI18n,
    i18n_source_lang: idiomaOrigen,
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
    codiPostal: shop.postal_code ?? undefined,
    localitatId: shop.locality_id ?? undefined,
    localitatNom: shop.town_name ?? undefined,
    telefon: shop.phone ?? undefined,
    web: shop.website ?? undefined,
    estat: ESTAT_FROM_API[shop.status] ?? "inactiu",
    qrGenerat: Boolean(shop.qr_code),
    nPromocionsActives,
    dataAlta: shop.created_at,
  };
}

export function comercAdminToCreate(input: ComercAdminInput): Record<string, unknown> {
  return {
    name: input.nom,
    emoji: null,
    categories: categoriesToApi(input.categories),
    contact_email: input.emailContacte,
    visit_points: input.puntsPerVisita,
    address: input.adreca || null,
    postal_code: input.codiPostal || null,
    // Only when chosen: without it the API takes the town from the postal
    // code, or the only one the municipality has.
    ...(input.localitatId ? { locality_id: input.localitatId } : {}),
    phone: input.telefon || null,
    website: input.web || null,
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

/** "5€" / "3,50 €" → 5 / 3.5 */
function parseImport(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/\d+(?:[.,]\d+)?/);
  if (!match) return undefined;
  const num = Number.parseFloat(match[0].replace(",", "."));
  return Number.isFinite(num) ? num : undefined;
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
    codi: r.code ?? undefined,
    comercId: r.shop_id ?? undefined,
    comercNom: opts?.comercNom,
    dataUs: r.used_at ?? undefined,
    importAplicat: r.amount_applied ?? undefined,
    importPagatNum: parseImport(r.amount_applied) ?? parseImport(r.amount),
    pagamentEstat:
      flux === "val_qr" && r.status === "used"
        ? r.payment_id
          ? "pagat"
          : "pendent"
        : undefined,
    pagamentId: r.payment_id ?? undefined,
    dataLliurament: r.delivered_at ?? undefined,
    historial,
  };
}

// —— Pagaments als comerços ——

export function deuteFromApi(d: ApiShopDebt): DeuteComerc {
  return {
    comercId: d.shop_id,
    comercNom: d.shop_name,
    nBescanvisPendents: d.pending_count,
    importPendent: d.pending_amount,
    importPagatHistoric: d.paid_total,
  };
}

export function pagamentFromApi(p: ApiShopPayment): PagamentComerc {
  return {
    id: p.id,
    poblacioId: p.town_id,
    comercId: p.shop_id,
    comercNom: p.shop_name,
    data: p.created_at,
    bescanviIds: p.redemption_ids,
    importTotal: p.total_amount,
    nota: p.note ?? undefined,
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
  const bust = town?.updated_at
    ? `?v=${encodeURIComponent(town.updated_at)}`
    : "";
  const logo = absoluteMediaUrl(town?.logo_url);
  return {
    id: user.id,
    poblacioId: user.town_id ?? town?.id ?? "",
    // The municipality, not `town_name`: for the admin of a municipality
    // that groups towns, that one is the town their account is tied to.
    poblacioNom: town?.name ?? user.municipality_name ?? user.town_name ?? "",
    localitats: (town?.localities ?? []).map((l) => ({
      id: l.id,
      nom: l.name,
      codisPostals: l.postal_codes ?? [],
    })),
    nom: user.name ?? user.email,
    logoUrl: logo ? `${logo}${bust}` : undefined,
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
    logoUrl: absoluteMediaUrl(town.logo_url) ?? undefined,
    puntsPerEuro: town.points_per_euro ?? 200,
    caducitatMesos: town.expiry_months ?? undefined,
    puntsPerVisitaDefecte: town.default_visit_points ?? undefined,
    idiomaDefecte: (town.default_lang as IdiomaDefecte) ?? "ca",
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
    // Logo via PUT /towns/{id}/media/logo — do not send data URLs in logo_url
    points_per_euro: input.puntsPerEuro,
    default_visit_points: input.puntsPerVisitaDefecte ?? 10,
    default_lang: input.idiomaDefecte,
    expiry_months: input.caducitatMesos ?? null,
  };
}
