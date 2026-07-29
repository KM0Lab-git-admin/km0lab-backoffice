/** Shop category slugs ↔ legacy Catalan labels + API mapping.

API stores English slugs; UI labels live in i18n (`shopCategories.*`).
Legacy Catalan labels are still accepted when reading/writing.
*/

export const CATEGORY_SLUG_TO_LABEL: Record<string, string> = {
  bakery: "Fleca",
  food: "Alimentació",
  cafe: "Cafeteria",
  restaurant: "Restauració",
  bar: "Bar",
  butcher: "Carnisseria",
  greengrocer: "Fruiteria",
  fishmonger: "Peixateria",
  pharmacy: "Farmàcia",
  bookstore: "Llibreria",
  clothing: "Moda",
  hairdresser: "Perruqueria",
  services: "Serveis",
  other: "Altres",
};

export const CATEGORY_LABEL_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_TO_LABEL).map(([slug, label]) => [label, slug]),
);

/** Ordered list of category slugs (form options / API values). */
export const CATEGORY_SLUGS: readonly string[] = Object.keys(CATEGORY_SLUG_TO_LABEL);

/** @deprecated Prefer CATEGORY_SLUGS; kept for fixtures that still use Catalan labels. */
export const CATEGORY_LABELS: readonly string[] = Object.values(CATEGORY_SLUG_TO_LABEL);

export function categorySlugToLabel(slug: string): string {
  return CATEGORY_SLUG_TO_LABEL[slug] ?? slug;
}

/** Normalize slug or legacy Catalan label → API slug. */
export function categoryLabelToSlug(labelOrSlug: string): string {
  if (CATEGORY_SLUG_TO_LABEL[labelOrSlug]) return labelOrSlug;
  return CATEGORY_LABEL_TO_SLUG[labelOrSlug] ?? labelOrSlug;
}

/** API → UI: keep slugs (translate at render time). */
export function categoriesFromApi(slugs: string[]): string[] {
  return slugs.map(categoryLabelToSlug);
}

/** UI → API: accept slugs or legacy labels. */
export function categoriesToApi(values: string[]): string[] {
  return values.map(categoryLabelToSlug);
}
