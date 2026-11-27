import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Share2, Users, Store, Coins } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { useLang } from "@/contexts/LangContext";
import { adminService } from "@/services/adminService";
import {
  invitationsService,
  type AdminInviteConversion,
} from "@/services/invitationsService";
import { useSessionStore } from "@/stores/useSessionStore";

type KindFilter = "tots" | "person" | "business";
type StatusFilter = "tots" | "pending_reward" | "granted" | "failed";

export default function Invitacions() {
  const { t, lang } = useLang();
  const poblacioId = useSessionStore((s) => s.poblacioId);
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<KindFilter>("tots");
  const [status, setStatus] = useState<StatusFilter>("tots");
  const [selected, setSelected] = useState<AdminInviteConversion | null>(null);

  const me = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminService.getMe(),
  });

  const list = useQuery({
    queryKey: ["admin", "invites", poblacioId, kind, status],
    queryFn: () =>
      invitationsService.list({
        kind: kind === "tots" ? undefined : kind,
        status: status === "tots" ? undefined : status,
      }),
  });

  const retry = useMutation({
    mutationFn: (id: string) => invitationsService.retryReward(id),
    onSuccess: (row) => {
      toast.success(t("invitations.retry.ok"));
      setSelected(row);
      void queryClient.invalidateQueries({ queryKey: ["admin", "invites"] });
    },
    onError: () => toast.error(t("invitations.retry.error")),
  });

  const data = list.data;
  const rows = data?.conversions ?? [];
  const locale = lang === "en" ? "en-GB" : lang;

  const formatWhen = (iso: string | null) => {
    if (!iso) return "—";
    try {
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso.slice(0, 16);
    }
  };

  const tiles = useMemo(
    () => [
      {
        label: t("invitations.kpi.persons"),
        value: data?.persons_registered ?? 0,
        icon: Users,
      },
      {
        label: t("invitations.kpi.businesses"),
        value: data?.businesses_registered ?? 0,
        icon: Store,
      },
      {
        label: t("invitations.kpi.points"),
        value: data?.points_granted ?? 0,
        icon: Coins,
      },
      {
        label: t("invitations.kpi.shares"),
        value: data?.share_events ?? 0,
        icon: Share2,
      },
    ],
    [data, t],
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-brand text-2xl font-black text-km0-blue-800">
          {t("invitations.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("invitations.subtitle").replace(
            "{poblacio}",
            me.data?.poblacioNom ?? "",
          )}
        </p>
      </header>

      {list.isError ? (
        <ErrorState onRetry={() => void list.refetch()} />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {tiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-xl border bg-card p-3 shadow-sm"
              >
                <tile.icon className="mb-2 h-4 w-4 text-km0-blue-700" />
                <p className="text-xs text-muted-foreground">{tile.label}</p>
                <p className="font-ui text-xl font-black tabular-nums text-km0-blue-800">
                  {list.isLoading ? "—" : tile.value.toLocaleString(locale)}
                </p>
              </div>
            ))}
          </section>
          <p className="text-xs text-muted-foreground">
            {t("invitations.shares.note")}
          </p>

          <div className="flex flex-wrap gap-2">
            <Select
              value={kind}
              onValueChange={(v) => setKind(v as KindFilter)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tots">{t("invitations.filter.all")}</SelectItem>
                <SelectItem value="person">
                  {t("invitations.filter.person")}
                </SelectItem>
                <SelectItem value="business">
                  {t("invitations.filter.business")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as StatusFilter)}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tots">{t("invitations.filter.all")}</SelectItem>
                <SelectItem value="granted">
                  {t("invitations.status.granted")}
                </SelectItem>
                <SelectItem value="pending_reward">
                  {t("invitations.status.pending")}
                </SelectItem>
                <SelectItem value="failed">
                  {t("invitations.status.failed")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {list.isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              {t("invitations.empty")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("invitations.col.kind")}</TableHead>
                  <TableHead>{t("invitations.col.name")}</TableHead>
                  <TableHead>{t("invitations.col.status")}</TableHead>
                  <TableHead>{t("invitations.col.points")}</TableHead>
                  <TableHead>{t("invitations.col.when")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(row)}
                  >
                    <TableCell>
                      {row.kind === "person"
                        ? t("invitations.filter.person")
                        : t("invitations.filter.business")}
                    </TableCell>
                    <TableCell>{row.display_name ?? "—"}</TableCell>
                    <TableCell>
                      {t(
                        row.status === "granted"
                          ? "invitations.status.granted"
                          : row.status === "failed"
                            ? "invitations.status.failed"
                            : "invitations.status.pending",
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums">{row.points}</TableCell>
                    <TableCell>
                      {formatWhen(row.granted_at ?? row.completed_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}

      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{t("invitations.detail.title")}</SheetTitle>
                <SheetDescription>
                  {selected.display_name ?? selected.id}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <p>
                  {t("invitations.col.status")}:{" "}
                  {t(
                    selected.status === "granted"
                      ? "invitations.status.granted"
                      : selected.status === "failed"
                        ? "invitations.status.failed"
                        : "invitations.status.pending",
                  )}
                </p>
                <p>
                  {t("invitations.col.points")}: {selected.points}
                </p>
                <p>
                  {t("invitations.col.code")}: {selected.public_code ?? "—"}
                </p>
                {(selected.status === "failed" ||
                  selected.status === "pending_reward" ||
                  selected.status === "pending") && (
                  <Button
                    type="button"
                    className="mt-4"
                    disabled={retry.isPending}
                    onClick={() => retry.mutate(selected.id)}
                  >
                    {t("invitations.retry")}
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
