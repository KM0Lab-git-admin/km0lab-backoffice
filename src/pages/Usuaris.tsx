import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Gift,
  Mail,
  Phone,
  QrCode,
  Search,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { usuarisService } from "@/services/usuarisService";
import { invitationsService } from "@/services/invitationsService";
import { adminService } from "@/services/adminService";
import { useSessionStore } from "@/stores/useSessionStore";
import { ErrorState } from "@/components/backoffice/ErrorState";
import type {
  VeiActivitat,
  VeiActivitatTipus,
  VeiPrograma,
} from "@/types/backoffice";
import type { MessageKey } from "@/lib/i18n";

type NivellFilter = "tots" | "1" | "2" | "3" | "4" | "5";

const localeFor = (lang: string) => (lang === "en" ? "en-GB" : lang);

function formatDate(iso: string, lang: string): string {
  try {
    return new Intl.DateTimeFormat(localeFor(lang), {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function formatDateTime(iso: string, lang: string): string {
  try {
    return new Intl.DateTimeFormat(localeFor(lang), {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 16);
  }
}

function NivellBadge({ nivell }: { nivell: number }) {
  const { t } = useLang();
  return (
    <Badge
      variant="outline"
      className="border-km0-yellow-300 bg-km0-yellow-100/60 font-semibold text-km0-blue-800"
    >
      {t("usuaris.nivell.short")} {nivell}
    </Badge>
  );
}

function ContactCell({ v }: { v: VeiPrograma }) {
  const { t } = useLang();
  const phone = v.contacteCompartit ? v.telefon : undefined;
  if (!v.email && !phone) {
    return (
      <span className="text-xs italic text-muted-foreground">
        {t("usuaris.contact.none")}
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-0.5 text-xs">
      {v.email ? (
        <a
          href={`mailto:${v.email}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-km0-blue-700 hover:underline"
        >
          <Mail className="h-3 w-3" />
          {v.email}
        </a>
      ) : null}
      {phone ? (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-km0-blue-700 hover:underline"
        >
          <Phone className="h-3 w-3" />
          {phone}
        </a>
      ) : null}
    </div>
  );
}

const activitatIcon = {
  escaneig: QrCode,
  accio: Zap,
  bescanvi: Gift,
} as const;

const activitatLabelKey = (t: VeiActivitatTipus): MessageKey =>
  t === "escaneig"
    ? "usuaris.activitat.escaneig"
    : t === "accio"
      ? "usuaris.activitat.accio"
      : "usuaris.activitat.bescanvi";

export default function UsuarisPage() {
  const { t, lang } = useLang();
  const poblacioId = useSessionStore((s) => s.poblacioId);
  const locale = localeFor(lang);

  const meQ = useQuery({ queryKey: ["admin", "me"], queryFn: () => adminService.getMe() });
  const listQ = useQuery({
    queryKey: ["admin", "usuaris", poblacioId],
    queryFn: () => usuarisService.list(),
  });

  const [query, setQuery] = useState("");
  const [nivell, setNivell] = useState<NivellFilter>("tots");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const veins = listQ.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return veins.filter((v) => {
      if (nivell !== "tots" && v.nivell !== Number(nivell)) return false;
      if (!q) return true;
      return (
        v.nom.toLowerCase().includes(q) ||
        (v.email ? v.email.toLowerCase().includes(q) : false)
      );
    });
  }, [veins, query, nivell]);

  const selected = selectedId
    ? veins.find((v) => v.id === selectedId) ?? null
    : null;

  const invitesQ = useQuery({
    queryKey: ["admin", "invites", "user", selectedId],
    queryFn: () =>
      invitationsService.list({ inviterUserId: selectedId ?? undefined }),
    enabled: Boolean(selectedId),
  });

  const poblacioNom = meQ.data?.poblacioNom ?? "";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("usuaris.title")}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
          {t("usuaris.subtitle").replace("{poblacio}", poblacioNom)}
        </p>
      </header>

      {listQ.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : listQ.error ? (
        <ErrorState onRetry={() => listQ.refetch()} />
      ) : veins.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">{t("usuaris.empty.title")}</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {t("usuaris.empty.subtitle")}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("usuaris.search.placeholder")}
                className="pl-9"
                aria-label={t("usuaris.search.placeholder")}
              />
            </div>
            <Select value={nivell} onValueChange={(v) => setNivell(v as NivellFilter)}>
              <SelectTrigger className="sm:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tots">{t("usuaris.filter.allLevels")}</SelectItem>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {t("usuaris.nivell.short")} {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
              {t("usuaris.filter.noResults")}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-lg border md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("usuaris.col.nom")}</TableHead>
                      <TableHead className="text-right">{t("usuaris.col.punts")}</TableHead>
                      <TableHead>{t("usuaris.col.nivell")}</TableHead>
                      <TableHead className="text-right">
                        {t("usuaris.col.escanejos")}
                      </TableHead>
                      <TableHead>{t("usuaris.col.alta")}</TableHead>
                      <TableHead>{t("usuaris.col.ultima")}</TableHead>
                      <TableHead>{t("usuaris.col.email")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((v) => (
                      <TableRow
                        key={v.id}
                        onClick={() => setSelectedId(v.id)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-semibold text-km0-blue-800">
                          {v.nom}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {v.puntsAcumulats.toLocaleString(locale)}
                        </TableCell>
                        <TableCell>
                          <NivellBadge nivell={v.nivell} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {v.escanejos}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(v.dataAlta, lang)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(v.ultimaActivitat, lang)}
                        </TableCell>
                        <TableCell>
                          <ContactCell v={v} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="flex flex-col gap-3 md:hidden">
                {filtered.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-left shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-km0-blue-800">
                          {v.nom}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("usuaris.col.alta")}: {formatDate(v.dataAlta, lang)}
                        </p>
                      </div>
                      <NivellBadge nivell={v.nivell} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/40 px-3 py-2 text-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {t("usuaris.col.punts")}
                        </p>
                        <p className="text-sm font-semibold tabular-nums">
                          {v.puntsAcumulats.toLocaleString(locale)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {t("usuaris.col.escanejos")}
                        </p>
                        <p className="text-sm font-semibold tabular-nums">{v.escanejos}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {t("usuaris.col.ultima")}
                        </p>
                        <p className="text-sm font-semibold">
                          {formatDate(v.ultimaActivitat, lang)}
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-2 text-xs">
                      <ContactCell v={v} />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <Sheet
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelectedId(null);
        }}
      >
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader className="text-left">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 text-lg text-km0-blue-800">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <SheetTitle>{selected.nom}</SheetTitle>
                    <SheetDescription>
                      {t("usuaris.nivell.short")} {selected.nivell} ·{" "}
                      {selected.puntsAcumulats.toLocaleString(locale)}{" "}
                      {t("usuaris.detall.puntsAcumulats")}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 overflow-y-auto pr-1">
                <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <SummaryTile
                    label={t("usuaris.detall.escanejos")}
                    value={selected.escanejos.toString()}
                  />
                  <SummaryTile
                    label={t("usuaris.detall.comercos")}
                    value={selected.comercosVisitats.toString()}
                  />
                  <SummaryTile
                    label={t("usuaris.detall.bescanvis")}
                    value={selected.bescanvis.toString()}
                  />
                  <SummaryTile
                    label={t("usuaris.detall.alta")}
                    value={formatDate(selected.dataAlta, lang)}
                  />
                </section>

                <section className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("usuaris.detall.contacte")}
                  </p>
                  <ContactCell v={selected} />
                </section>

                <section className="flex flex-col gap-3">
                  <p className="text-sm font-semibold">
                    {t("usuaris.detall.invitacions")}
                  </p>
                  {invitesQ.isLoading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        <SummaryTile
                          label={t("invitations.kpi.persons")}
                          value={(invitesQ.data?.persons_registered ?? 0).toLocaleString(
                            locale,
                          )}
                        />
                        <SummaryTile
                          label={t("invitations.kpi.businesses")}
                          value={(
                            invitesQ.data?.businesses_registered ?? 0
                          ).toLocaleString(locale)}
                        />
                        <SummaryTile
                          label={t("invitations.kpi.points")}
                          value={(invitesQ.data?.points_granted ?? 0).toLocaleString(
                            locale,
                          )}
                        />
                      </div>
                      {(invitesQ.data?.conversions ?? []).length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {t("invitations.empty")}
                        </p>
                      ) : (
                        <ul className="flex flex-col gap-2">
                          {(invitesQ.data?.conversions ?? []).slice(0, 8).map((row) => (
                            <li
                              key={row.id}
                              className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-xs"
                            >
                              <span>
                                {row.display_name ?? "—"} ·{" "}
                                {row.kind === "person"
                                  ? t("invitations.filter.person")
                                  : t("invitations.filter.business")}
                              </span>
                              <span className="tabular-nums">+{row.points}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </section>

                <section className="flex flex-col gap-3">
                  <p className="text-sm font-semibold">
                    {t("usuaris.detall.historial")}
                  </p>
                  <ActivitatList activitat={selected.activitat ?? []} lang={lang} />
                </section>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-3">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-lg font-semibold tabular-nums text-km0-blue-800">
        {value}
      </span>
    </div>
  );
}

function ActivitatList({
  activitat,
  lang,
}: {
  activitat: VeiActivitat[];
  lang: string;
}) {
  const { t } = useLang();
  if (activitat.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
        {t("usuaris.detall.historialEmpty")}
      </div>
    );
  }
  return (
    <ul className="flex flex-col divide-y rounded-lg border bg-card">
      {activitat.map((a) => {
        const Icon = activitatIcon[a.tipus];
        const positive = a.punts >= 0;
        return (
          <li key={a.id} className="flex items-center gap-3 px-3 py-3">
            <div
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                a.tipus === "escaneig" && "bg-km0-blue-100 text-km0-blue-700",
                a.tipus === "accio" && "bg-km0-yellow-100 text-km0-blue-800",
                a.tipus === "bescanvi" && "bg-km0-teal-100 text-km0-teal-700",
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{a.descripcio}</p>
              <p className="text-xs text-muted-foreground">
                {t(activitatLabelKey(a.tipus))} · {formatDateTime(a.data, lang)}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 text-sm font-semibold tabular-nums",
                positive ? "text-km0-teal-700" : "text-destructive",
              )}
            >
              {positive ? "+" : ""}
              {a.punts}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
