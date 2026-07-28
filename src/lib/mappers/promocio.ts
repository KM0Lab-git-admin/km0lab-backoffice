import type { PromoTipus, Promocio, PromocioInput } from "@/types/comerc";
import type { ApiPromotion } from "@/types/api";

const TIPUS_TO_API: Record<PromoTipus, string> = {
  descompte: "discount",
  dos_x_un: "two_for_one",
  regal: "gift",
  preu_especial: "special_price",
};

const TIPUS_FROM_API: Record<string, PromoTipus> = {
  discount: "descompte",
  two_for_one: "dos_x_un",
  gift: "regal",
  special_price: "preu_especial",
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

export function promocioFromApi(p: ApiPromotion): Promocio {
  return {
    id: p.id,
    tipus: TIPUS_FROM_API[p.type] ?? "descompte",
    etiqueta: p.label,
    titol: p.title,
    detall: p.detail,
    valor: p.value ?? undefined,
    compraMinima: p.min_purchase ?? undefined,
    vigenciaInici: isoDate(p.valid_from),
    vigenciaFi: isoDate(p.valid_until),
    condicio: p.conditions ?? undefined,
    activa: p.active,
  };
}

export function promocioToCreate(input: PromocioInput): Record<string, unknown> {
  return {
    type: TIPUS_TO_API[input.tipus],
    label: input.etiqueta?.trim() || null,
    title: input.titol,
    detail: input.detall ?? "",
    value: input.valor ?? null,
    min_purchase: input.compraMinima ?? null,
    valid_from: toIsoDateTime(input.vigenciaInici),
    valid_until: toIsoDateTime(input.vigenciaFi),
    conditions: input.condicio ?? null,
    active: input.activa,
  };
}

export function promocioToUpdate(input: PromocioInput): Record<string, unknown> {
  return promocioToCreate(input);
}
