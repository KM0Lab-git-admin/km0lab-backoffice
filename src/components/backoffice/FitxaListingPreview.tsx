import { useLang } from "@/contexts/LangContext";
import { categoryLabelToSlug } from "@/lib/mappers/categories";
import type { ComercFitxa } from "@/types/comerc";
import type { MessageKey } from "@/lib/i18n";

type Props = {
  fitxa: ComercFitxa;
};

export function FitxaListingPreview({ fitxa }: Props) {
  const { t } = useLang();
  const categoriesLine = fitxa.categories
    .filter(Boolean)
    .map((c) => t(`shopCategories.${categoryLabelToSlug(c)}` as MessageKey))
    .join(" · ");

  return (
    <div className="rounded-2xl border border-km0-beige-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-km0-beige-100">
          {fitxa.logoUrl ? (
            <img
              src={fitxa.logoUrl}
              alt={fitxa.nom}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-1 text-center text-[10px] text-muted-foreground">
              {t("fitxa.preview.logoPlaceholder")}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-km0-blue-800">
            {fitxa.nom || "—"}
          </p>
          {categoriesLine ? (
            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-km0-teal-500">
              {categoriesLine}
            </p>
          ) : null}
          <p className="truncate text-xs text-km0-blue-500">
            {fitxa.adreca || "—"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gradient-to-b from-km0-yellow-300 to-km0-yellow-400 px-2.5 py-1 text-xs font-black text-km0-blue-800">
          {t("fitxa.preview.points")}
        </span>
      </div>
    </div>
  );
}
