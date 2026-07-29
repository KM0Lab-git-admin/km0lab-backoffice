import { Bell, ChevronLeft, Globe, MapPin, Phone, ScanLine } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { categoryLabelToSlug } from "@/lib/mappers/categories";
import type { ComercFitxa, DiaSetmana } from "@/types/comerc";
import type { MessageKey } from "@/lib/i18n";

const dayOrder: DiaSetmana[] = [
  "dilluns",
  "dimarts",
  "dimecres",
  "dijous",
  "divendres",
  "dissabte",
  "diumenge",
];

function todayIndex(): number {
  // Monday=0 .. Sunday=6
  const jsDay = new Date().getDay(); // Sun=0..Sat=6
  return (jsDay + 6) % 7;
}

type Props = {
  fitxa: ComercFitxa;
};

export function FitxaPreview({ fitxa }: Props) {
  const { t } = useLang();

  const today = dayOrder[todayIndex()];
  const horariAvui = fitxa.horari[today];
  const obertAra = !horariAvui.tancat;
  const categoriesLine = fitxa.categories
    .filter(Boolean)
    .map((c) => t(`shopCategories.${categoryLabelToSlug(c)}` as MessageKey))
    .join(" · ")
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[32px] border-2 border-km0-blue-800/80 bg-km0-beige-50 shadow-xl">
      {/* Hero */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2 px-4 pt-4">
          <button
            type="button"
            aria-label="back"
            className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-km0-yellow-400 bg-white/70 text-km0-blue-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-lg font-black leading-none text-km0-blue-800">
              Malgrat de Mar
            </p>
            <span className="mt-1 inline-flex items-center rounded-md bg-km0-blue-700 px-2 py-0.5 text-[10px] font-black tracking-wide text-km0-beige-100">
              KM0 LAB
            </span>
          </div>
          <button
            type="button"
            aria-label="notifications"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-km0-blue-800 shadow"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 aspect-[16/10] w-full overflow-hidden bg-km0-beige-100">
          {fitxa.heroUrl ? (
            <img
              src={fitxa.heroUrl}
              alt={fitxa.nom}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-km0-blue-500">
              {t("fitxa.preview.heroPlaceholder")}
            </div>
          )}
        </div>
      </div>

      {/* Logo panel */}
      <div className="bg-km0-beige-100 px-6 py-6">
        <div className="mx-auto flex aspect-square w-40 items-center justify-center overflow-hidden rounded-2xl bg-white">
          {fitxa.logoUrl ? (
            <img
              src={fitxa.logoUrl}
              alt={fitxa.nom}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center text-xs text-muted-foreground">
              {t("fitxa.preview.logoPlaceholder")}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 bg-km0-beige-50 px-5 pt-4 pb-6">
        {categoriesLine ? (
          <p className="text-xs font-black tracking-wider text-km0-teal-500">
            {categoriesLine}
          </p>
        ) : null}
        <h3 className="text-2xl font-bold leading-tight text-km0-blue-800">
          {fitxa.nom || "—"}
        </h3>
        <p className="text-sm">
          {obertAra ? (
            <>
              <span className="font-bold text-km0-teal-500">
                {t("fitxa.horari.obertAra")}
              </span>
              <span className="text-km0-blue-500">
                {" · "}
                {t("fitxa.horari.tancaAvui").replace("{hora}", horariAvui.tancament)}
                {" · 240 m"}
              </span>
            </>
          ) : (
            <span className="font-bold text-km0-coral-500">
              {t("fitxa.horari.tancatAvui")}
            </span>
          )}
        </p>

        {/* Visit toggle mock */}
        <div className="inline-flex rounded-full bg-white p-1">
          <span className="rounded-full bg-km0-blue-800 px-4 py-1.5 text-xs font-bold text-white">
            {t("fitxa.preview.encaraNoVisitat")}
          </span>
          <span className="px-4 py-1.5 text-xs font-medium text-km0-blue-500">
            {t("fitxa.preview.jaEscanejat")}
          </span>
        </div>

        {/* Scan card */}
        <div className="rounded-2xl bg-km0-blue-800 p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10">
              <ScanLine className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold">Guanya +20 punts</p>
              <p className="text-xs text-white/80">
                Escaneja el QR del taulell en visitar-lo
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-km0-yellow-300 to-km0-yellow-400 py-2.5 text-sm font-bold text-km0-blue-800"
          >
            <ScanLine className="h-4 w-4" />
            Escanejar QR
          </button>
        </div>

        {/* Description */}
        {fitxa.descripcio ? (
          <p className="text-sm text-km0-blue-500">{fitxa.descripcio}</p>
        ) : null}

        {/* Info list */}
        <div>
          <p className="mb-2 text-lg font-bold text-km0-blue-800">
            {t("fitxa.preview.info")}
          </p>
          <ul className="space-y-3">
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              title={fitxa.adreca || "—"}
              subtitle={
                [fitxa.codiPostal, fitxa.poblacio].filter(Boolean).join(" · ") ||
                "—"
              }
              caption={t("fitxa.preview.adreca")}
            />
            <InfoRow
              icon={<Clock />}
              title={
                horariAvui.tancat
                  ? t("fitxa.horari.tancatAvui")
                  : `${horariAvui.obertura}–${horariAvui.tancament}`
              }
              subtitle={
                obertAra ? (
                  <span className="text-km0-teal-500">
                    {t("fitxa.horari.obertAra")}
                  </span>
                ) : (
                  " "
                )
              }
              caption={t("fitxa.preview.horariAvui")}
            />
            {fitxa.telefon ? (
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                title={fitxa.telefon}
                caption={t("fitxa.preview.telefon")}
                action={t("fitxa.preview.trucar")}
              />
            ) : null}
            {fitxa.web ? (
              <InfoRow
                icon={<Globe className="h-4 w-4" />}
                title={fitxa.web}
                caption={t("fitxa.preview.web")}
                action={t("fitxa.preview.obrir")}
              />
            ) : null}
          </ul>
        </div>

        {/* Weekly schedule */}
        <div className="rounded-2xl bg-white p-4">
          <ul className="space-y-1.5 text-sm">
            {dayOrder.map((d) => {
              const h = fitxa.horari[d];
              const key = `fitxa.day.${d}` as MessageKey;
              const isToday = d === today;
              return (
                <li
                  key={d}
                  className={`flex items-center justify-between gap-2 ${
                    isToday ? "font-bold text-km0-blue-800" : "text-km0-blue-500"
                  }`}
                >
                  <span>{t(key)}</span>
                  <span>
                    {h.tancat
                      ? t("fitxa.horari.tancat")
                      : `${h.obertura}–${h.tancament}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Clock() {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function InfoRow({
  icon,
  title,
  subtitle,
  caption,
  action,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  caption: string;
  action?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-km0-yellow-300 text-km0-blue-800">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold text-km0-blue-800">{title}</p>
        {subtitle ? <p className="text-sm">{subtitle}</p> : null}
        <p className="text-xs text-km0-blue-500">{caption}</p>
      </div>
      {action ? (
        <button
          type="button"
          className="rounded-full bg-km0-blue-50 px-3 py-1 text-xs font-bold text-km0-blue-700"
        >
          {action}
        </button>
      ) : null}
    </li>
  );
}
