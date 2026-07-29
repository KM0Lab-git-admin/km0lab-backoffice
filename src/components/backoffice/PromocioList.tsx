import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { promoBadgeLabel } from "@/lib/promoBadge";
import type { Promocio } from "@/types/comerc";

function DiscBadge({ label }: { label: string }) {
  const compact = label.length > 4;
  return (
    <div
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 px-0.5 text-center font-black leading-tight text-km0-blue-800",
        compact ? "text-2xs" : "text-xs",
      )}
    >
      {label}
    </div>
  );
}


type Props = {
  promocions: Promocio[];
  onEdit: (promo: Promocio) => void;
  onDelete: (promo: Promocio) => void;
  onToggle: (promo: Promocio, activa: boolean) => void;
};

export function PromocioTable({ promocions, onEdit, onDelete, onToggle }: Props) {
  const { t } = useLang();

  return (
    <div className="hidden overflow-hidden rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">{t("promos.col.promo")}</TableHead>
            <TableHead>{t("promos.col.state")}</TableHead>
            <TableHead className="text-right">{t("promos.col.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promocions.map((p) => (
            <TableRow key={p.id} className={cn(!p.activa && "opacity-60")}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <DiscBadge label={promoBadgeLabel(p, t)} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.titol}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.detall}
                      {p.compraMinima ? ` · +${p.compraMinima}` : ""}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={p.activa}
                    onCheckedChange={(v) => onToggle(p, v)}
                    aria-label={t(p.activa ? "promos.state.active" : "promos.state.inactive")}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t(p.activa ? "promos.state.active" : "promos.state.inactive")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(p)}
                    aria-label={t("common.edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(p)}
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

export function PromocioCards({ promocions, onEdit, onDelete, onToggle }: Props) {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {promocions.map((p) => (
        <div
          key={p.id}
          className={cn(
            "flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm",
            !p.activa && "opacity-60",
          )}
        >
          <div className="flex items-start gap-3">
            <DiscBadge label={promoBadgeLabel(p, t)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.titol}</p>
              <p className="text-xs text-muted-foreground">
                {p.detall}
                {p.compraMinima ? ` · +${p.compraMinima}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={p.activa}
                onCheckedChange={(v) => onToggle(p, v)}
                aria-label={t(p.activa ? "promos.state.active" : "promos.state.inactive")}
              />
              <span className="text-xs text-muted-foreground">
                {t(p.activa ? "promos.state.active" : "promos.state.inactive")}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(p)}
                aria-label={t("common.edit")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(p)}
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
