import type { DiaSetmana, Horari, HorariDia } from "@/types/merchant";
import type { ApiDayHours, ApiOpeningHours } from "@/types/api";

export const DIAS_CA_TO_EN: Record<
  DiaSetmana,
  keyof ApiOpeningHours
> = {
  dilluns: "monday",
  dimarts: "tuesday",
  dimecres: "wednesday",
  dijous: "thursday",
  divendres: "friday",
  dissabte: "saturday",
  diumenge: "sunday",
};

export const DIAS_EN_TO_CA: Record<keyof ApiOpeningHours, DiaSetmana> = {
  monday: "dilluns",
  tuesday: "dimarts",
  wednesday: "dimecres",
  thursday: "dijous",
  friday: "divendres",
  saturday: "dissabte",
  sunday: "diumenge",
};

const DIAS_CA: DiaSetmana[] = [
  "dilluns",
  "dimarts",
  "dimecres",
  "dijous",
  "divendres",
  "dissabte",
  "diumenge",
];

function dayFromApi(d: ApiDayHours | undefined): HorariDia {
  if (!d || d.closed) {
    return { tancat: true, obertura: "09:00", tancament: "14:00" };
  }
  return {
    tancat: false,
    obertura: d.opens ?? "09:00",
    tancament: d.closes ?? "14:00",
  };
}

function dayToApi(d: HorariDia): ApiDayHours {
  if (d.tancat) {
    return { closed: true, opens: null, closes: null, opens_2: null, closes_2: null };
  }
  return {
    closed: false,
    opens: d.obertura,
    closes: d.tancament,
    opens_2: null,
    closes_2: null,
  };
}

export function defaultHorari(): Horari {
  return Object.fromEntries(
    DIAS_CA.map((d) => [d, { tancat: true, obertura: "09:00", tancament: "14:00" }]),
  ) as Horari;
}

export function horariFromApi(hours: ApiOpeningHours | null | undefined): Horari {
  if (!hours) return defaultHorari();
  const out = defaultHorari();
  for (const ca of DIAS_CA) {
    const en = DIAS_CA_TO_EN[ca];
    out[ca] = dayFromApi(hours[en]);
  }
  return out;
}

export function horariToApi(horari: Horari): ApiOpeningHours {
  return {
    monday: dayToApi(horari.dilluns),
    tuesday: dayToApi(horari.dimarts),
    wednesday: dayToApi(horari.dimecres),
    thursday: dayToApi(horari.dijous),
    friday: dayToApi(horari.divendres),
    saturday: dayToApi(horari.dissabte),
    sunday: dayToApi(horari.diumenge),
  };
}
