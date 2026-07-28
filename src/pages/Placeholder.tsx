import { useLang } from "@/contexts/LangContext";

type Props = {
  titleKey?: never;
  title?: string;
};

export default function PlaceholderPage({ title }: Props) {
  const { t } = useLang();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
      <h1 className="text-2xl font-bold tracking-tight">{title ?? t("placeholder.title")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("placeholder.subtitle")}</p>
    </div>
  );
}
