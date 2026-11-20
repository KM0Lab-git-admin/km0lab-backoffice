import { Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { RecompensaTipusIcon } from "@/components/backoffice/recompensaTipusIcon";
import type { MessageKey } from "@/lib/i18n";
import type { Recompensa, RecompensaEstat, RecompensaTipus } from "@/types/backoffice";

export function tipusLabelKey(t: RecompensaTipus): MessageKey {
  switch (t) {
    case "descompte":
      return "recompenses.tipus.descompte";
    case "saldo":
      return "recompenses.tipus.saldo";
    case "producte":
      return "recompenses.tipus.producte";
    case "servei":
      return "recompenses.tipus.servei";
    case "marxandatge":
      return "recompenses.tipus.marxandatge";
    case "experiencia":
      return "recompenses.tipus.experiencia";
  }
}

export function estatLabelKey(e: RecompensaEstat): MessageKey {
  switch (e) {
    case "activa":
      return "recompenses.estat.activa";
    case "inactiva":
      return "recompenses.estat.inactiva";
    case "esgotada":
      return "recompenses.estat.esgotada";
  }
}

function PuntsPill({ punts }: { punts: number }) {
  return (
    <div className="inline-flex items-center rounded-full bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 px-2.5 py-1 text-xs font-black text-km0-blue-800">
      {punts.toLocaleString()} pts
    </div>
  );
}

function EstatBadge({ estat }: { estat: RecompensaEstat }) {
  const { t } = useLang();
  const label = t(estatLabelKey(estat));
  if (estat === "activa") {
    return (
      <Badge className="border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
        {label}
      </Badge>
    );
  }
  if (estat === "esgotada") {
    return (
      <Badge className="border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100">
        {label}
      </Badge>
    );
  }
  return <Badge variant="secondary">{label}</Badge>;
}

export function totesBloquejades(recompenses: Recompensa[]): boolean {
  return recompenses.length > 0 && recompenses.every((r) => r.contingutBloquejat === true);
}

type Props = {
  recompenses: Recompensa[];
  onEdit: (r: Recompensa) => void;
  onDelete: (r: Recompensa) => void;
  onToggleEstat: (r: Recompensa, activa: boolean) => void;
  savingId: string | null;
};

export function RecompensaGrid({
  recompenses,
  onEdit,
  onDelete,
  onToggleEstat,
  savingId,
}: Props) {
  const { t } = useLang();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recompenses.map((r) => {
        const atenuada = r.estat !== "activa";
        const comercosLabel =
          r.comercos === "tots"
            ? t("recompenses.card.usableAll")
            : t("recompenses.card.usableCount").replace(
                "{count}",
                String(r.comercos.length),
              );

        return (
          <div
            key={r.id}
            className={cn(
              "flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm",
              atenuada && "opacity-70",
            )}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              {r.imatgeUrl ? (
                <img
                  key={r.imatgeUrl}
                  src={r.imatgeUrl}
                  alt={r.nom}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-km0-yellow-300/40 to-km0-yellow-400/50 text-km0-blue-800">
                  <RecompensaTipusIcon tipus={r.tipus} className="h-12 w-12" />
                </div>
              )}
              <div className="absolute left-3 top-3">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                  {t(tipusLabelKey(r.tipus))}
                </Badge>
              </div>
              <div className="absolute right-3 top-3">
                <EstatBadge estat={r.estat} />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold">{r.nom}</h3>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {r.descripcio}
                  </p>
                </div>
                <PuntsPill punts={r.puntsNecessaris} />
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs">
                {r.valor ? (
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">{t("recompenses.card.value")}</dt>
                    <dd className="truncate font-medium">{r.valor}</dd>
                  </div>
                ) : null}
                <div className="min-w-0">
                  <dt className="text-muted-foreground">{t("recompenses.card.stock")}</dt>
                  <dd className="flex items-center gap-1 truncate font-medium">
                    <Package className="h-3.5 w-3.5" aria-hidden />
                    {typeof r.estoc === "number"
                      ? r.estoc
                      : t("recompenses.card.stockUnlimited")}
                  </dd>
                </div>
                <div className="col-span-2 min-w-0">
                  <dd className="truncate text-muted-foreground">{comercosLabel}</dd>
                </div>
              </dl>

              <div className="mt-auto flex items-center justify-end gap-1 border-t pt-3">
                {r.contingutBloquejat ? (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    {r.estat === "esgotada" ? (
                      <span className="text-xs font-normal text-muted-foreground">
                        {t("recompenses.card.senseExistencies")}
                      </span>
                    ) : null}
                    <span>{t("recompenses.card.actiu")}</span>
                    <Switch
                      checked={r.estat === "activa"}
                      disabled={r.estat === "esgotada" || savingId === r.id}
                      onCheckedChange={(v) => onToggleEstat(r, v)}
                      aria-label={t("recompenses.card.actiu")}
                    />
                  </label>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(r)}
                      aria-label={t("common.edit")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(r)}
                      aria-label={t("common.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
