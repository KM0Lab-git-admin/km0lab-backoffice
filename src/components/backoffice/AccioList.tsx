import {
  Pencil,
  Trash2,
  UserPlus,
  QrCode,
  Globe,
  Mail,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import type { MessageKey } from "@/lib/i18n";
import type { AccioPunts, AccioPuntsTipus } from "@/types/backoffice";

const TIPUS_ICON: Record<AccioPuntsTipus, LucideIcon> = {
  registre: UserPlus,
  escaneig_qr: QrCode,
  visita_web: Globe,
  registre_web: Mail,
  esdeveniment: CalendarDays,
  personalitzada: Sparkles,
};

export function tipusLabelKey(tp: AccioPuntsTipus): MessageKey {
  switch (tp) {
    case "registre":
      return "accions.tipus.registre";
    case "escaneig_qr":
      return "accions.tipus.escaneig_qr";
    case "visita_web":
      return "accions.tipus.visita_web";
    case "registre_web":
      return "accions.tipus.registre_web";
    case "esdeveniment":
      return "accions.tipus.esdeveniment";
    case "personalitzada":
      return "accions.tipus.personalitzada";
  }
}

function TipusIcon({ tipus }: { tipus: AccioPuntsTipus }) {
  const Icon = TIPUS_ICON[tipus];
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-km0-blue-800 text-km0-yellow-300">
      <Icon className="h-5 w-5" />
    </div>
  );
}

function PuntsBadge({ punts }: { punts: number }) {
  return (
    <div className="inline-flex items-center rounded-full bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 px-2.5 py-1 text-xs font-black text-km0-blue-800">
      +{punts} pts
    </div>
  );
}

type Props = {
  accions: AccioPunts[];
  onEdit: (a: AccioPunts) => void;
  onDelete: (a: AccioPunts) => void;
  onToggle: (a: AccioPunts, activa: boolean) => void;
};

export function AccioTable({ accions, onEdit, onDelete, onToggle }: Props) {
  const { t } = useLang();

  return (
    <div className="hidden overflow-hidden rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">{t("accions.col.accio")}</TableHead>
            <TableHead>{t("accions.col.tipus")}</TableHead>
            <TableHead>{t("accions.col.punts")}</TableHead>
            <TableHead>{t("accions.col.estat")}</TableHead>
            <TableHead className="text-right">{t("accions.col.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accions.map((a) => (
            <TableRow key={a.id} className={cn(!a.activa && "opacity-60")}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <TipusIcon tipus={a.tipus} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.nom}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.descripcio}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{t(tipusLabelKey(a.tipus))}</Badge>
              </TableCell>
              <TableCell>
                <PuntsBadge punts={a.punts} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={a.activa}
                    onCheckedChange={(v) => onToggle(a, v)}
                    aria-label={t(a.activa ? "accions.state.active" : "accions.state.inactive")}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t(a.activa ? "accions.state.active" : "accions.state.inactive")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(a)}
                    aria-label={t("common.edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(a)}
                    aria-label={t("common.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
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

export function AccioCards({ accions, onEdit, onDelete, onToggle }: Props) {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {accions.map((a) => (
        <div
          key={a.id}
          className={cn(
            "flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm",
            !a.activa && "opacity-60",
          )}
        >
          <div className="flex items-start gap-3">
            <TipusIcon tipus={a.tipus} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{a.nom}</p>
              <p className="text-xs text-muted-foreground">{a.descripcio}</p>
            </div>
            <PuntsBadge punts={a.punts} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{t(tipusLabelKey(a.tipus))}</Badge>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={a.activa}
                onCheckedChange={(v) => onToggle(a, v)}
                aria-label={t(a.activa ? "accions.state.active" : "accions.state.inactive")}
              />
              <span className="text-xs text-muted-foreground">
                {t(a.activa ? "accions.state.active" : "accions.state.inactive")}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(a)}
                aria-label={t("common.edit")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(a)}
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
