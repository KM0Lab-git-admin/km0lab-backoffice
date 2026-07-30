/** Shared i18n types for multilingual entity fields (ca/es/en). */

export type Lang = "ca" | "es" | "en";

export type I18nMap = Partial<Record<Lang, string>>;

export const LANGS: readonly Lang[] = ["ca", "es", "en"] as const;

export function normalizeLang(value: string | null | undefined): Lang {
  const v = (value || "").trim().toLowerCase();
  return v === "es" || v === "en" || v === "ca" ? v : "ca";
}

/** Build an I18nMap from a legacy plain string under the given source lang. */
export function seedI18n(
  plain: string | null | undefined,
  source: Lang = "ca",
  existing?: I18nMap | null,
): I18nMap {
  if (existing && Object.keys(existing).length > 0) {
    return { ...existing };
  }
  if (plain && plain.trim()) {
    return { [source]: plain.trim() };
  }
  return {};
}

/** Pick the best plain string for lists/legacy from an i18n map. */
export function pickPlain(
  i18n: I18nMap | null | undefined,
  source: Lang = "ca",
  legacy?: string | null,
): string {
  if (i18n?.[source]?.trim()) return i18n[source]!.trim();
  if (i18n?.ca?.trim()) return i18n.ca.trim();
  for (const lang of LANGS) {
    if (i18n?.[lang]?.trim()) return i18n[lang]!.trim();
  }
  return (legacy ?? "").trim();
}
