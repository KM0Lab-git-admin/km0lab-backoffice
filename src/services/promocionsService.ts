import type { Promocio, PromocioInput, PromoTipus } from "@/types/comerc";
import { useBackofficeStore } from "@/stores/useBackofficeStore";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms + Math.random() * 300));

function etiquetaFor(input: PromocioInput): string {
  if (input.etiqueta && input.etiqueta.trim()) return input.etiqueta.trim();
  switch (input.tipus) {
    case "descompte":
      return input.valor ? `-${input.valor.replace(/^-/, "")}` : "-%";
    case "dos_x_un":
      return "2×1";
    case "regal":
      return "Regal";
    case "preu_especial":
      return input.valor ?? "Preu";
  }
}

function newId(): string {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const promocionsService = {
  async list(): Promise<Promocio[]> {
    await delay(400);
    return useBackofficeStore.getState().promocions;
  },

  async create(input: PromocioInput): Promise<Promocio> {
    await delay(500);
    const promo: Promocio = { ...input, etiqueta: etiquetaFor(input), id: newId() };
    useBackofficeStore.getState().upsertPromocio(promo);
    return promo;
  },

  async update(id: string, input: PromocioInput): Promise<Promocio> {
    await delay(500);
    const promo: Promocio = { ...input, etiqueta: etiquetaFor(input), id };
    useBackofficeStore.getState().upsertPromocio(promo);
    return promo;
  },

  async toggle(id: string, activa: boolean): Promise<void> {
    await delay(300);
    useBackofficeStore.getState().togglePromocio(id, activa);
  },

  async remove(id: string): Promise<void> {
    await delay(300);
    useBackofficeStore.getState().removePromocio(id);
  },
};

export const promoTipusList: PromoTipus[] = [
  "descompte",
  "dos_x_un",
  "regal",
  "preu_especial",
];
