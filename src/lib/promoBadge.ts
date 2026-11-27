import type { MessageKey } from "@/lib/i18n";
import type { PromoTipus, Promocio } from "@/types/merchant";

/** Short yellow-badge label from type (+ discount %). Never the promo title. */
export function formatDiscountBadge(valor?: string): string {
  const raw = valor?.trim();
  if (!raw) return "%";
  if (raw.includes("%")) {
    const cleaned = raw.replace(/^\+/, "");
    return cleaned.startsWith("-") ? cleaned : `-${cleaned}`;
  }
  const n = raw.replace(/[^\d.,]/g, "");
  return n ? `-${n}%` : "%";
}

/** Stable label stored in API (default CA). UI display uses `promoBadgeLabel` + i18n. */
export function promoBadgeLabelForStorage(
  tipus: PromoTipus,
  valor?: string,
): string {
  switch (tipus) {
    case "descompte":
      return formatDiscountBadge(valor);
    case "dos_x_un":
      return "2×1";
    case "regal":
      return "Regal";
    case "preu_especial":
      return "Preu especial";
  }
}

type Translate = (key: MessageKey) => string;

export function promoBadgeLabel(
  promo: Pick<Promocio, "tipus" | "valor">,
  t: Translate,
): string {
  switch (promo.tipus) {
    case "descompte":
      return formatDiscountBadge(promo.valor);
    case "dos_x_un":
      return t("form.type.dos_x_un");
    case "regal":
      return t("form.type.regal");
    case "preu_especial":
      return t("form.type.preu_especial");
  }
}
