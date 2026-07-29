import { Pencil, QrCode, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { categoryLabelToSlug } from "@/lib/mappers/categories";
import type { MessageKey } from "@/lib/i18n";
import type { ComercAdmin, ComercEstat } from "@/types/backoffice";

export const estatLabelKey = (e: ComercEstat): MessageKey =>
  e === "actiu" ? "comercos.estat.actiu" : "comercos.estat.inactiu";

function EstatBadge({ estat }: { estat: ComercEstat }) {
  const { t } = useLang();
  const cls =
    estat === "actiu"
      ? "bg-km0-teal-100 text-km0-teal-700 border-km0-teal-200"
      : "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={cn("font-medium", cls)}>
      {t(estatLabelKey(estat))}
    </Badge>
  );
}

function ComercAvatar({ comerc }: { comerc: ComercAdmin }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 text-lg text-km0-blue-800">
      {comerc.emoji ? <span>{comerc.emoji}</span> : <Store className="h-4 w-4" />}
    </div>
  );
}

function formatDate(iso: string, lang: string): string {
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

type Props = {
  comercos: ComercAdmin[];
  onEdit: (c: ComercAdmin) => void;
  onToggle: (c: ComercAdmin, actiu: boolean) => void;
};

export function ComercoTable({ comercos, onEdit, onToggle }: Props) {
  const { t, lang } = useLang();
  const categoryLabel = (value: string) =>
    t(`shopCategories.${categoryLabelToSlug(value)}` as MessageKey);

  return (
    <div className="hidden overflow-hidden rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[32%]">{t("comercos.col.comerc")}</TableHead>
            <TableHead>{t("comercos.col.categories")}</TableHead>
            <TableHead>{t("comercos.col.estat")}</TableHead>
            <TableHead className="text-center">{t("comercos.col.qr")}</TableHead>
            <TableHead className="text-center">{t("comercos.col.promos")}</TableHead>
            <TableHead className="text-center">{t("comercos.col.punts")}</TableHead>
            <TableHead>{t("comercos.col.alta")}</TableHead>
            <TableHead className="text-right">{t("comercos.col.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comercos.map((c) => (
            <TableRow
              key={c.id}
              className={cn(c.estat === "inactiu" && "opacity-60")}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <ComercAvatar comerc={c} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.nom}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.emailContacte}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {c.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="font-normal">
                      {categoryLabel(cat)}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <EstatBadge estat={c.estat} />
              </TableCell>
              <TableCell className="text-center">
                {c.qrGenerat ? (
                  <QrCode className="mx-auto h-4 w-4 text-km0-blue-700" aria-hidden />
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-center text-sm tabular-nums">
                {c.nPromocionsActives}
              </TableCell>
              <TableCell className="text-center text-sm tabular-nums">
                +{c.puntsPerVisita}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(c.dataAlta, lang)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={c.estat === "actiu"}
                      onCheckedChange={(v) => onToggle(c, v)}
                      aria-label={t(estatLabelKey(c.estat))}
                    />
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(c)}
                    aria-label={t("common.edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ComercoCards({ comercos, onEdit, onToggle }: Props) {
  const { t, lang } = useLang();
  const categoryLabel = (value: string) =>
    t(`shopCategories.${categoryLabelToSlug(value)}` as MessageKey);

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {comercos.map((c) => (
        <div
          key={c.id}
          className={cn(
            "flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm",
            c.estat === "inactiu" && "opacity-60",
          )}
        >
          <div className="flex items-start gap-3">
            <ComercAvatar comerc={c} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-semibold">{c.nom}</p>
                <EstatBadge estat={c.estat} />
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {c.emailContacte}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {c.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="font-normal">
                    {categoryLabel(cat)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/40 px-3 py-2 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {t("comercos.col.qr")}
              </p>
              <p className="text-sm font-semibold">
                {c.qrGenerat ? t("common.yes") : t("common.no")}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {t("comercos.col.promos")}
              </p>
              <p className="text-sm font-semibold tabular-nums">{c.nPromocionsActives}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {t("comercos.col.punts")}
              </p>
              <p className="text-sm font-semibold tabular-nums">+{c.puntsPerVisita}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">
              {t("comercos.card.altaLabel")} {formatDate(c.dataAlta, lang)}
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={c.estat === "actiu"}
                onCheckedChange={(v) => onToggle(c, v)}
                aria-label={t(estatLabelKey(c.estat))}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(c)}
                aria-label={t("common.edit")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
