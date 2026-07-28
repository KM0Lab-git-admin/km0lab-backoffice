import { useLang } from "@/contexts/LangContext";
import type { Lang } from "@/lib/i18n";

const OPTIONS: { value: Extract<Lang, "ca" | "es">; label: string }[] = [
  { value: "ca", label: "CA" },
  { value: "es", label: "ES" },
];

export function LangSwitcher() {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t("lang.switcher.label")}
      className="inline-flex items-center gap-0.5 rounded-full border bg-background p-0.5"
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(opt.value)}
            className={
              "rounded-full px-2.5 py-1 text-xs font-bold transition-colors " +
              (active
                ? "bg-km0-blue-800 text-km0-beige-100"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
