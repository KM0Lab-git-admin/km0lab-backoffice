// Domain types for the backoffice roles: comerç and admin.

export type Rol = "admin" | "comerc";

export type Poblacio = {
  id: string;
  nom: string;
};

export type Sessio = {
  rol: Rol;
  poblacioId: string;
  comercId?: string;
  nom: string;
};

export type AdminMe = {
  id: string;
  poblacioId: string;
  poblacioNom: string;
  nom: string;
  /** Town brand logo (Settings / config). */
  logoUrl?: string;
};

export type AdminResumStats = {
  usuarisActius: number;
  puntsCirculacio: number;
  bescanvisMes: number;
  accionsActives: number;
  accionsTotals: number;
};

export type AccioTipus =
  | "registre"
  | "escaneig"
  | "web"
  | "esdeveniment"
  | "compra"
  | "altre";

export type AccioTop = {
  id: string;
  nom: string;
  tipus: AccioTipus;
  punts: number;
  usos: number;
  emoji: string;
};

export type BescanviResum = {
  id: string;
  recompensaNom: string;
  usuari: string;
  quan: string;
  punts: number;
  emoji: string;
};


// Admin · Accions de punts (llistat + alta/edició)
export type AccioPuntsTipus =
  | "registre"
  | "primer_escaneig"
  | "escaneig_qr"
  | "aniversari"
  | "visita_web"
  | "registre_web"
  | "esdeveniment"
  | "personalitzada";


export type CooldownUnitat = "dies" | "setmanes" | "mesos";

export type AccioPunts = {
  id: string;
  poblacioId: string;
  tipus: AccioPuntsTipus;
  nom: string;
  descripcio: string;
  nomI18n?: import("@/types/i18n").I18nMap;
  descripcioI18n?: import("@/types/i18n").I18nMap;
  idiomaOrigen?: import("@/types/i18n").Lang;
  punts: number;
  limitPerUsuari?: number;
  limitTotal?: number;
  vigenciaInici?: string;
  vigenciaFi?: string;
  condicions?: string;
  activa: boolean;
  // Si l'acció apareix destacada a la home de l'app dels veïns.
  // Algunes accions (aniversari, primer registre) no tenen sentit a la home.
  visibleAHome?: boolean;
  url?: string;
  esdevenimentId?: string;
  comercId?: string;
  // Només per a `escaneig_qr`: interval abans que el mateix usuari pugui
  // tornar a escanejar el QR del mateix comerç i rebre punts.
  // undefined = sense cooldown (comportament actual).
  cooldownValor?: number;
  cooldownUnitat?: CooldownUnitat;
};

export type AccioPuntsInput = Omit<AccioPunts, "id" | "poblacioId">;

export type ComercOption = { id: string; nom: string };
export type EsdevenimentOption = { id: string; nom: string };

// Admin · Recompenses (catàleg + alta/edició)
export type RecompensaTipus =
  | "descompte"
  | "saldo"
  | "producte"
  | "servei"
  | "marxandatge"
  | "experiencia";

export type RecompensaEstat = "activa" | "inactiva" | "esgotada";

export type Recompensa = {
  id: string;
  poblacioId: string;
  nom: string;
  descripcio: string;
  nomI18n?: import("@/types/i18n").I18nMap;
  descripcioI18n?: import("@/types/i18n").I18nMap;
  idiomaOrigen?: import("@/types/i18n").Lang;
  imatgeUrl?: string;
  tipus: RecompensaTipus;
  puntsNecessaris: number;
  valor?: string;
  comercos: string[] | "tots";
  estoc?: number; // undefined = il·limitat
  dataInici?: string;
  dataFi?: string;
  condicions?: string;
  estat: RecompensaEstat;
};

export type RecompensaInput = Omit<Recompensa, "id" | "poblacioId">;

// Admin · Comerços (llistat + alta/invitació)
export type ComercEstat = "actiu" | "inactiu";

export type ComercAdmin = {
  id: string;
  poblacioId: string;
  nom: string;
  emoji?: string;
  logoUrl?: string;
  categories: string[];
  emailContacte: string;
  puntsPerVisita: number;
  adreca?: string;
  codiPostal?: string;
  telefon?: string;
  web?: string;
  estat: ComercEstat;
  qrGenerat: boolean;
  nPromocionsActives: number;
  dataAlta: string; // ISO
};

export type ComercAdminInput = {
  nom: string;
  emoji?: string;
  logoUrl?: string;
  categories: string[];
  emailContacte: string;
  puntsPerVisita: number;
  adreca?: string;
  codiPostal?: string;
  telefon?: string;
  web?: string;
};

// Admin · Usuaris (veïns del programa)
export type VeiActivitatTipus = "escaneig" | "accio" | "bescanvi";

export type VeiActivitat = {
  id: string;
  tipus: VeiActivitatTipus;
  descripcio: string;
  data: string;
  punts: number; // positiu = guanya, negatiu = bescanvia
};

export type VeiPrograma = {
  id: string;
  poblacioId: string;
  nom: string;
  puntsAcumulats: number;
  nivell: number;
  escanejos: number;
  comercosVisitats: number;
  bescanvis: number;
  dataAlta: string;
  ultimaActivitat: string;
  contacteCompartit: boolean;
  email?: string;
  telefon?: string;
  activitat?: VeiActivitat[];
};


// Admin · Configuració de la població
export type EntitatTipus = "ajuntament" | "privada";
export type IdiomaDefecte = "ca" | "es" | "en";

export type PoblacioConfig = {
  poblacioId: string;
  poblacioNom: string; // read-only
  entitatNom: string;
  entitatTipus: EntitatTipus;
  contacteEmail: string;
  responsable: string;
  logoUrl?: string;
  puntsPerEuro: number; // ex: 200 -> 1.000 pts = 5 €
  caducitatMesos?: number; // undefined = no caduquen
  puntsPerVisitaDefecte?: number;
  idiomaDefecte: IdiomaDefecte;
};

export type PoblacioConfigInput = Omit<PoblacioConfig, "poblacioId" | "poblacioNom">;

// Admin · Bescanvis (seguiment dels premis bescanviats pels veïns)
export type BescanviFlux = "val_qr" | "lliurament";

export type BescanviEstat =
  | "pendent_us"
  | "utilitzat"
  | "solicitat"
  | "pendent_preparacio"
  | "preparat"
  | "pendent_recollida"
  | "entregat"
  | "cancel·lat";

export type BescanviHist = {
  estat: BescanviEstat;
  data: string; // ISO
  nota?: string;
};

export type BescanviPagamentEstat = "pendent" | "pagat";

export type Bescanvi = {
  id: string;
  poblacioId: string;
  usuariId: string;
  usuariNom: string;
  recompensaId: string;
  recompensaNom: string;
  recompensaTipus: RecompensaTipus;
  flux: BescanviFlux;
  puntsDescomptats: number;
  dataSolicitud: string; // ISO
  estat: BescanviEstat;
  // val_qr
  import?: string;
  qrGenerat?: boolean;
  codi?: string; // codi de 5 dígits que el veí ensenya al comerç
  comercId?: string;
  comercNom?: string;
  dataUs?: string;
  importAplicat?: string;
  // val_qr · pagament al comerç
  importPagatNum?: number; // import numèric del val a abonar al comerç
  pagamentEstat?: BescanviPagamentEstat;
  pagamentId?: string;
  dataPagament?: string;
  // lliurament
  dataLliurament?: string;
  historial?: BescanviHist[];
};

export type BescanviFiltres = {
  query?: string;
  tipus?: RecompensaTipus | "tots";
  estat?: BescanviEstat | "tots";
  comercId?: string | "tots";
  pagament?: "tots" | "pendent" | "pagat" | "no_aplica";
  desde?: string;
  fins?: string;
};

export function deriveBescanviFlux(tipus: RecompensaTipus): BescanviFlux {
  return tipus === "saldo" || tipus === "descompte" ? "val_qr" : "lliurament";
}

// Admin · Pagaments als comerços (liquidació dels vals utilitzats)
export type PagamentComerc = {
  id: string;
  poblacioId: string;
  comercId: string;
  comercNom: string;
  data: string; // ISO
  bescanviIds: string[];
  importTotal: number;
  nota?: string;
};

export type DeuteComerc = {
  comercId: string;
  comercNom: string;
  nBescanvisPendents: number;
  importPendent: number;
  importPagatHistoric: number;
};



