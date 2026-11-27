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
    return {
      tancat: true,
      obertura: "09:00",
      tancament: "14:00",
      obertura2: "",
      tancament2: "",
    };
  }
  return {
    tancat: false,
    obertura: d.opens ?? "09:00",
    tancament: d.closes ?? "14:00",
    obertura2: d.opens_2 ?? "",
    tancament2: d.closes_2 ?? "",
  };
}

/** Normalize browser time values to HH:mm for the API. */
function toHm(value: string | undefined | null): string | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  const m = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(v);
  return m ? `${m[1]}:${m[2]}` : v;
}

function dayToApi(d: HorariDia): ApiDayHours {
  if (d.tancat) {
    return { closed: true, opens: null, closes: null, opens_2: null, closes_2: null };
  }
  const opens2 = toHm(d.obertura2);
  const closes2 = toHm(d.tancament2);
  return {
    closed: false,
    opens: toHm(d.obertura),
    closes: toHm(d.tancament),
    opens_2: opens2 && closes2 ? opens2 : null,
    closes_2: opens2 && closes2 ? closes2 : null,
  };
}

export function defaultHorari(): Horari {
  return Object.fromEntries(
    DIAS_CA.map((d) => [
      d,
      {
        tancat: true,
        obertura: "09:00",
        tancament: "14:00",
        obertura2: "",
        tancament2: "",
      },
    ]),
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

/** Display "09:00–14:00 · 17:00–20:00" for a day. */
export function formatHorariDia(d: HorariDia): string {
  if (d.tancat) return "";
  const first = `${d.obertura}–${d.tancament}`;
  if (d.obertura2?.trim() && d.tancament2?.trim()) {
    return `${first} · ${d.obertura2}–${d.tancament2}`;
  }
  return first;
}
