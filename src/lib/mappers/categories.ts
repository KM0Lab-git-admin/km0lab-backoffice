/** Category slug ↔ Catalan label used by the fitxa multi-select. */

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

export const CATEGORY_LABELS: readonly string[] = Object.values(CATEGORY_SLUG_TO_LABEL);

export function categorySlugToLabel(slug: string): string {
  return CATEGORY_SLUG_TO_LABEL[slug] ?? slug;
}

export function categoryLabelToSlug(labelOrSlug: string): string {
  if (CATEGORY_SLUG_TO_LABEL[labelOrSlug]) return labelOrSlug;
  return CATEGORY_LABEL_TO_SLUG[labelOrSlug] ?? labelOrSlug;
}

export function categoriesFromApi(slugs: string[]): string[] {
  return slugs.map(categorySlugToLabel);
}

export function categoriesToApi(labels: string[]): string[] {
  return labels.map(categoryLabelToSlug);
}
