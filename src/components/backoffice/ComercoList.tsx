import { LogIn, Pencil, QrCode, Store } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { fitxaService } from "@/services/fitxaService";
import type { MessageKey } from "@/lib/i18n";
import type { ComercAdmin, ComercEstat, Poblacio } from "@/types/backoffice";

const estatKeys: Record<ComercEstat, MessageKey> = {
  pendent_validar: "alta.estat.pendent",
  esperant_comerc: "alta.estat.esperant",
  actiu: "comercos.estat.actiu",
  inactiu: "comercos.estat.inactiu",
  rebutjat: "alta.estat.rebutjat",
};

export const estatLabelKey = (e: ComercEstat): MessageKey => estatKeys[e];

const estatBadgeClass: Record<ComercEstat, string> = {
  pendent_validar: "bg-km0-yellow-100 text-km0-blue-800 border-km0-yellow-300",
  esperant_comerc: "bg-km0-blue-50 text-km0-blue-700 border-km0-blue-100",
  actiu: "bg-km0-teal-100 text-km0-teal-700 border-km0-teal-200",
  inactiu: "bg-muted text-muted-foreground border-border",
  rebutjat: "bg-destructive/10 text-destructive border-destructive/30",
};

function EstatBadge({ estat }: { estat: ComercEstat }) {
  const { t } = useLang();
  const cls = estatBadgeClass[estat];
  return (
    <Badge variant="outline" className={cn("font-medium", cls)}>
      {t(estatLabelKey(estat))}
    </Badge>
  );
}

function ComercAvatar({ comerc }: { comerc: ComercAdmin }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 text-lg text-km0-blue-800">
      {comerc.logoUrl ? (
        <img
          src={comerc.logoUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <Store className="h-4 w-4" />
      )}
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
  onActAs?: (c: ComercAdmin) => void;
  mostrarPoblacio: boolean;
  onReview?: (c: ComercAdmin) => void;
};

const esToggleable = (e: ComercEstat) => e === "actiu" || e === "inactiu";

function RowActions({
  c,
  onEdit,
  onToggle,
  onActAs,
  onReview,
}: { c: ComercAdmin } & Pick<Props, "onEdit" | "onToggle" | "onActAs" | "onReview">) {
  const { t } = useLang();
  if (c.estat === "pendent_validar" || c.estat === "rebutjat") {
    return (
      <div className="flex items-center justify-end gap-2">
        {c.estat === "rebutjat" ? (
          <span className="text-xs text-muted-foreground">{t("alta.admin.rejectedHelp")}</span>
        ) : null}
        {onReview ? (
          <Button variant="outline" size="sm" onClick={() => onReview(c)}>
            {t("alta.admin.review")}
          </Button>
        ) : null}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end gap-2">
      {esToggleable(c.estat) ? (
        <Switch
          checked={c.estat === "actiu"}
          onCheckedChange={(v) => onToggle(c, v)}
          aria-label={t(estatLabelKey(c.estat))}
        />
      ) : null}
      {/* De producción: el administrador entra a gestionar ese comercio. */}
      {onActAs ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onActAs(c)}
          aria-label={t("comercos.actAs")}
          title={t("comercos.actAs")}
        >
          <LogIn className="h-4 w-4" />
        </Button>
      ) : null}
      <Button variant="ghost" size="icon" onClick={() => onEdit(c)} aria-label={t("common.edit")}>
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function municipiAmbDiversesPoblacions(poblacions: Poblacio[] | undefined): boolean {
  return (poblacions?.length ?? 0) > 1;
}

export function ComercoTable({ comercos, onEdit, onToggle, onActAs, mostrarPoblacio, onReview }: Props) {
  const { t, lang } = useLang();
  const categoriesQ = useQuery({
    queryKey: ["shop-categories", lang],
    queryFn: () => fitxaService.listCategories(lang),
    staleTime: 60_000,
  });
  const categoryLabel = (value: string) => {
    const slug = categoryLabelToSlug(value);
    const row = categoriesQ.data?.find((c) => c.slug === slug);
    const label = row?.label ?? t(`shopCategories.${slug}` as MessageKey);
    return row?.emoji ? `${row.emoji} ${label}` : label;
  };

  return (
    <div className="hidden overflow-hidden rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[32%]">{t("comercos.col.comerc")}</TableHead>
            {mostrarPoblacio ? <TableHead>{t("comercos.col.poblacio")}</TableHead> : null}
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
              className={cn((c.estat === "inactiu" || c.estat === "rebutjat") && "opacity-60")}
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
              {mostrarPoblacio ? (
                <TableCell className="text-sm">{c.poblacioNom ?? "—"}</TableCell>
              ) : null}
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
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(c.dataAlta, lang)}
              </TableCell>
              <TableCell className="text-right">
                <RowActions c={c} onEdit={onEdit} onToggle={onToggle} onActAs={onActAs} onReview={onReview} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ComercoCards({ comercos, onEdit, onToggle, onActAs, mostrarPoblacio, onReview }: Props) {
  const { t, lang } = useLang();
  const categoriesQ = useQuery({
    queryKey: ["shop-categories", lang],
    queryFn: () => fitxaService.listCategories(lang),
    staleTime: 60_000,
  });
  const categoryLabel = (value: string) => {
    const slug = categoryLabelToSlug(value);
    const row = categoriesQ.data?.find((c) => c.slug === slug);
    const label = row?.label ?? t(`shopCategories.${slug}` as MessageKey);
    return row?.emoji ? `${row.emoji} ${label}` : label;
  };

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {comercos.map((c) => (
        <div
          key={c.id}
          className={cn(
            "flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm",
            (c.estat === "inactiu" || c.estat === "rebutjat") && "opacity-60",
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
              {mostrarPoblacio && c.poblacioNom ? (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {t("comercos.col.poblacio")}: {c.poblacioNom}
                </p>
              ) : null}
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
            <RowActions c={c} onEdit={onEdit} onToggle={onToggle} onActAs={onActAs} onReview={onReview} />
          </div>
        </div>
      ))}
    </div>
  );
}
