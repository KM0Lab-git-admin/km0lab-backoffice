import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QrCode, Search, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { adminService } from "@/services/adminService";
import { adminComercosService } from "@/services/adminComercosService";
import { bescanvisService } from "@/services/bescanvisService";
import { ErrorState } from "@/components/backoffice/ErrorState";
import type {
  Bescanvi,
  BescanviEstat,
  BescanviFiltres,
  RecompensaTipus,
} from "@/types/backoffice";
import type { MessageKey } from "@/lib/i18n";

const TIPUS_OPTIONS: RecompensaTipus[] = [
  "saldo",
  "descompte",
  "producte",
  "servei",
  "marxandatge",
  "experiencia",
];

const ESTAT_OPTIONS: BescanviEstat[] = [
  "pendent_us",
  "utilitzat",
  "solicitat",
  "pendent_preparacio",
  "preparat",
  "pendent_recollida",
  "entregat",
  "cancel·lat",
];

const LLIURAMENT_ORDER: BescanviEstat[] = [
  "solicitat",
  "pendent_preparacio",
  "preparat",
  "pendent_recollida",
  "entregat",
];

const localeFor = (lang: string) => (lang === "en" ? "en-GB" : lang);

function formatDate(iso: string | undefined, lang: string): string {
  if (!iso) return "—";
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

function formatDateTime(iso: string | undefined, lang: string): string {
  if (!iso) return "—";
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

const tipusKey = (t: RecompensaTipus): MessageKey =>
  `bescanvis.tipus.${t}` as MessageKey;

const estatKey = (e: BescanviEstat): MessageKey =>
  `bescanvis.estat.${e}` as MessageKey;

function estatBadgeClass(estat: BescanviEstat): string {
  switch (estat) {
    case "utilitzat":
    case "entregat":
      return "border-transparent bg-km0-teal-500/15 text-km0-teal-500";
    case "cancel·lat":
      return "border-transparent bg-destructive/10 text-destructive";
    case "pendent_us":
    case "pendent_preparacio":
    case "pendent_recollida":
      return "border-transparent bg-km0-yellow-300/25 text-km0-blue-800";
    case "preparat":
    case "solicitat":
      return "border-transparent bg-km0-blue-50 text-km0-blue-700";
    default:
      return "";
  }
}

function EstatBadge({ estat }: { estat: BescanviEstat }) {
  const { t } = useLang();
  return (
    <Badge variant="outline" className={cn("font-semibold", estatBadgeClass(estat))}>
      {t(estatKey(estat))}
    </Badge>
  );
}

function TipusBadge({ tipus }: { tipus: RecompensaTipus }) {
  const { t } = useLang();
  return (
    <Badge variant="outline" className="text-xs">
      {t(tipusKey(tipus))}
    </Badge>
  );
}

function nextLliuramentEstat(estat: BescanviEstat): BescanviEstat | null {
  const idx = LLIURAMENT_ORDER.indexOf(estat);
  if (idx < 0 || idx >= LLIURAMENT_ORDER.length - 1) return null;
  return LLIURAMENT_ORDER[idx + 1] ?? null;
}

function isFinalEstat(estat: BescanviEstat): boolean {
  return estat === "utilitzat" || estat === "entregat" || estat === "cancel·lat";
}

export default function BescanvisPage() {
  const { t, lang } = useLang();
  const qc = useQueryClient();

  const meQ = useQuery({ queryKey: ["admin", "me"], queryFn: () => adminService.getMe() });
  const comercosQ = useQuery({
    queryKey: ["admin", "comercos"],
    queryFn: () => adminComercosService.list(),
  });
  const listQ = useQuery({
    queryKey: ["admin", "bescanvis"],
    queryFn: () => bescanvisService.list(),
  });

  const [query, setQuery] = useState("");
  const [tipus, setTipus] = useState<RecompensaTipus | "tots">("tots");
  const [estat, setEstat] = useState<BescanviEstat | "tots">("tots");
  const [comercId, setComercId] = useState<string | "tots">("tots");
  const [desde, setDesde] = useState("");
  const [fins, setFins] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nota, setNota] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  const bescanvis = listQ.data ?? [];

  const filtres: BescanviFiltres = { query, tipus, estat, comercId, desde, fins };
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bescanvis.filter((b) => {
      if (q && !b.usuariNom.toLowerCase().includes(q)) return false;
      if (tipus !== "tots" && b.recompensaTipus !== tipus) return false;
      if (estat !== "tots" && b.estat !== estat) return false;
      if (comercId !== "tots" && b.comercId !== comercId) return false;
      if (desde && b.dataSolicitud < desde) return false;
      if (fins && b.dataSolicitud > `${fins}T23:59:59`) return false;
      return true;
    });
  }, [bescanvis, query, tipus, estat, comercId, desde, fins]);

  const selected = selectedId ? bescanvis.find((b) => b.id === selectedId) ?? null : null;
  const poblacioNom = meQ.data?.poblacioNom ?? "";

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "bescanvis"] });

  const advanceMut = useMutation({
    mutationFn: (input: { id: string; estat: BescanviEstat; nota?: string }) =>
      bescanvisService.updateEstat(input.id, input.estat, input.nota),
    onSuccess: () => {
      invalidate();
      toast.success(t("bescanvis.toast.estatUpdated"));
      setNota("");
    },
    onError: () => toast.error(t("bescanvis.toast.error")),
  });

  const cancelMut = useMutation({
    mutationFn: (input: { id: string; nota?: string }) =>
      bescanvisService.cancel(input.id, input.nota),
    onSuccess: () => {
      invalidate();
      toast.success(t("bescanvis.toast.cancelled"));
      setNota("");
      setConfirmCancel(false);
    },
    onError: () => toast.error(t("bescanvis.toast.error")),
  });

  const filtresActius =
    !!query || tipus !== "tots" || estat !== "tots" || comercId !== "tots" || !!desde || !!fins;

  function clearFilters() {
    setQuery("");
    setTipus("tots");
    setEstat("tots");
    setComercId("tots");
    setDesde("");
    setFins("");
  }

  const kpiTotal = bescanvis.length;
  const kpiPendents = useMemo(
    () =>
      bescanvis.filter(
        (b) =>
          b.estat !== "utilitzat" && b.estat !== "entregat" && b.estat !== "cancel·lat",
      ).length,
    [bescanvis],
  );
  const kpiCompletats = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return bescanvis.filter((b) => {
      if (b.estat !== "utilitzat" && b.estat !== "entregat") return false;
      const ref = b.dataUs ?? b.dataLliurament;
      if (!ref) return false;
      const d = new Date(ref);
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
  }, [bescanvis]);

  const comercosOptions = comercosQ.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("bescanvis.title")}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
          {t("bescanvis.subtitle").replace("{poblacio}", poblacioNom)}
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
      ) : bescanvis.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <KpiTile label={t("bescanvis.kpi.total")} value={kpiTotal} />
            <KpiTile label={t("bescanvis.kpi.pendents")} value={kpiPendents} />
            <KpiTile label={t("bescanvis.kpi.completats")} value={kpiCompletats} />
          </section>

          <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("bescanvis.search.placeholder")}
                  className="pl-9"
                  aria-label={t("bescanvis.search.placeholder")}
                />
              </div>
              <Select value={tipus} onValueChange={(v) => setTipus(v as RecompensaTipus | "tots")}>
                <SelectTrigger aria-label={t("bescanvis.filter.tipus")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tots">{t("bescanvis.filter.allTipus")}</SelectItem>
                  {TIPUS_OPTIONS.map((tp) => (
                    <SelectItem key={tp} value={tp}>
                      {t(tipusKey(tp))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={estat} onValueChange={(v) => setEstat(v as BescanviEstat | "tots")}>
                <SelectTrigger aria-label={t("bescanvis.filter.estat")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tots">{t("bescanvis.filter.allEstats")}</SelectItem>
                  {ESTAT_OPTIONS.map((e) => (
                    <SelectItem key={e} value={e}>
                      {t(estatKey(e))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={comercId} onValueChange={(v) => setComercId(v)}>
                <SelectTrigger aria-label={t("bescanvis.filter.comerc")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tots">{t("bescanvis.filter.allComercos")}</SelectItem>
                  {comercosOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="besc-desde" className="text-xs">
                  {t("bescanvis.filter.desde")}
                </Label>
                <Input
                  id="besc-desde"
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="besc-fins" className="text-xs">
                  {t("bescanvis.filter.fins")}
                </Label>
                <Input
                  id="besc-fins"
                  type="date"
                  value={fins}
                  onChange={(e) => setFins(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!filtresActius}
                  className="w-full sm:w-auto"
                >
                  {t("bescanvis.filter.clear")}
                </Button>
              </div>
            </div>
          </section>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
              {t("bescanvis.filter.noResults")}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-lg border md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("bescanvis.col.usuari")}</TableHead>
                      <TableHead>{t("bescanvis.col.premi")}</TableHead>
                      <TableHead className="text-right">
                        {t("bescanvis.col.punts")}
                      </TableHead>
                      <TableHead>{t("bescanvis.col.dataSolicitud")}</TableHead>
                      <TableHead>{t("bescanvis.col.estat")}</TableHead>
                      <TableHead>{t("bescanvis.col.comerc")}</TableHead>
                      <TableHead>{t("bescanvis.col.dataUs")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((b) => (
                      <TableRow
                        key={b.id}
                        onClick={() => setSelectedId(b.id)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-semibold text-km0-blue-800">
                          {b.usuariNom}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">{b.recompensaNom}</span>
                            <div className="flex flex-wrap items-center gap-1">
                              <TipusBadge tipus={b.recompensaTipus} />
                              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                {t(
                                  b.flux === "val_qr"
                                    ? "bescanvis.flux.val_qr"
                                    : "bescanvis.flux.lliurament",
                                )}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-destructive">
                          −{b.puntsDescomptats.toLocaleString(localeFor(lang))}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(b.dataSolicitud, lang)}
                        </TableCell>
                        <TableCell>
                          <EstatBadge estat={b.estat} />
                        </TableCell>
                        <TableCell className="text-xs">
                          {b.comercNom ?? (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(b.dataUs ?? b.dataLliurament, lang)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="flex flex-col gap-3 md:hidden">
                {filtered.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedId(b.id)}
                    className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-left shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-km0-blue-800">
                          {b.usuariNom}
                        </p>
                        <p className="truncate text-sm">{b.recompensaNom}</p>
                      </div>
                      <EstatBadge estat={b.estat} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <TipusBadge tipus={b.recompensaTipus} />
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {t(
                          b.flux === "val_qr"
                            ? "bescanvis.flux.val_qr"
                            : "bescanvis.flux.lliurament",
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/40 px-3 py-2 text-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {t("bescanvis.col.punts")}
                        </p>
                        <p className="text-sm font-semibold tabular-nums text-destructive">
                          −{b.puntsDescomptats.toLocaleString(localeFor(lang))}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {t("bescanvis.col.dataSolicitud")}
                        </p>
                        <p className="text-xs font-medium">
                          {formatDate(b.dataSolicitud, lang)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {t("bescanvis.col.dataUs")}
                        </p>
                        <p className="text-xs font-medium">
                          {formatDate(b.dataUs ?? b.dataLliurament, lang)}
                        </p>
                      </div>
                    </div>
                    {b.comercNom ? (
                      <p className="text-xs text-muted-foreground">
                        {t("bescanvis.col.comerc")}: {b.comercNom}
                      </p>
                    ) : null}
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
          if (!o) {
            setSelectedId(null);
            setNota("");
          }
        }}
      >
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
          {selected ? (
            <BescanviDetail
              b={selected}
              lang={lang}
              nota={nota}
              onNotaChange={setNota}
              onAdvance={(nextEstat) =>
                advanceMut.mutate({ id: selected.id, estat: nextEstat, nota: nota || undefined })
              }
              onCancel={() => setConfirmCancel(true)}
              busy={advanceMut.isPending}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={confirmCancel}
        onOpenChange={(o) => {
          if (!o) setConfirmCancel(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("bescanvis.confirmCancel.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("bescanvis.confirmCancel.body")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selected && cancelMut.mutate({ id: selected.id, nota: nota || undefined })
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState() {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Ticket className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold">{t("bescanvis.empty.title")}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {t("bescanvis.empty.subtitle")}
      </p>
    </div>
  );
}

function KpiTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-2xl font-bold tabular-nums text-km0-blue-800">{value}</span>
    </div>
  );
}

function BescanviDetail({
  b,
  lang,
  nota,
  onNotaChange,
  onAdvance,
  onCancel,
  busy,
}: {
  b: Bescanvi;
  lang: string;
  nota: string;
  onNotaChange: (v: string) => void;
  onAdvance: (estat: BescanviEstat) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const { t } = useLang();
  const locale = localeFor(lang);
  const isFinal = isFinalEstat(b.estat);
  const nextEstat = b.flux === "lliurament" ? nextLliuramentEstat(b.estat) : null;

  return (
    <>
      <SheetHeader className="text-left">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 text-km0-blue-800">
            <Ticket className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <SheetTitle>{b.recompensaNom}</SheetTitle>
            <SheetDescription>
              {b.usuariNom} ·{" "}
              {t(
                b.flux === "val_qr"
                  ? "bescanvis.flux.val_qr"
                  : "bescanvis.flux.lliurament",
              )}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
        <section className="grid grid-cols-2 gap-3">
          <InfoTile
            label={t("bescanvis.detall.punts")}
            value={`−${b.puntsDescomptats.toLocaleString(locale)}`}
          />
          <InfoTile
            label={t("bescanvis.detall.dataSolicitud")}
            value={formatDate(b.dataSolicitud, lang)}
          />
          <div className="col-span-2 flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {t("bescanvis.detall.estatActual")}
            </span>
            <div>
              <EstatBadge estat={b.estat} />
            </div>
          </div>
        </section>

        {b.flux === "val_qr" ? (
          <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-km0-blue-50 text-km0-blue-700">
                {b.qrGenerat ? <QrCode className="h-8 w-8" /> : <QrCode className="h-8 w-8 opacity-30" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {t("bescanvis.detall.import")}: {b.import ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("bescanvis.detall.qrGenerat")}:{" "}
                  {b.qrGenerat ? t("common.yes") : t("common.no")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <InfoRow
                label={t("bescanvis.detall.comerc")}
                value={b.comercNom ?? t("bescanvis.detall.sensecomerc")}
              />
              <InfoRow
                label={t("bescanvis.detall.dataUs")}
                value={formatDateTime(b.dataUs, lang)}
              />
              <InfoRow
                label={t("bescanvis.detall.importAplicat")}
                value={b.importAplicat ?? "—"}
              />
            </div>
            <p className="text-xs italic text-muted-foreground">
              {t("bescanvis.detall.valNote")}
            </p>
          </section>
        ) : (
          <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <InfoRow
              label={t("bescanvis.detall.dataLliurament")}
              value={formatDateTime(b.dataLliurament, lang)}
            />
            {!isFinal ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="besc-nota" className="text-xs">
                    {t("bescanvis.detall.notaOpt")}
                  </Label>
                  <Textarea
                    id="besc-nota"
                    value={nota}
                    onChange={(e) => onNotaChange(e.target.value)}
                    placeholder={t("bescanvis.detall.notaPlaceholder")}
                    rows={2}
                  />
                </div>
                {nextEstat ? (
                  <Button
                    type="button"
                    onClick={() => onAdvance(nextEstat)}
                    disabled={busy}
                  >
                    {t("bescanvis.detall.advance").replace(
                      "{estat}",
                      t(estatKey(nextEstat)),
                    )}
                  </Button>
                ) : null}
              </>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                {t("bescanvis.detall.finalState")}
              </p>
            )}
          </section>
        )}

        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{t("bescanvis.detall.historial")}</p>
          <HistorialList b={b} lang={lang} />
        </section>
      </div>

      {!isFinal ? (
        <div className="flex justify-end border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            {b.flux === "val_qr"
              ? t("bescanvis.detall.cancelVal")
              : t("bescanvis.detall.cancel")}
          </Button>
        </div>
      ) : null}
    </>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-3">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-km0-blue-800">{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed py-1.5 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function HistorialList({ b, lang }: { b: Bescanvi; lang: string }) {
  const { t } = useLang();
  const items = b.historial ?? [];
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card p-4 text-center text-sm text-muted-foreground">
        {t("bescanvis.detall.historialEmpty")}
      </div>
    );
  }
  return (
    <ul className="flex flex-col divide-y rounded-lg border bg-card">
      {items.map((h, i) => (
        <li key={`${h.estat}-${h.data}-${i}`} className="flex flex-col gap-1 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <EstatBadge estat={h.estat} />
            <span className="text-xs text-muted-foreground">
              {formatDateTime(h.data, lang)}
            </span>
          </div>
          {h.nota ? (
            <p className="text-xs italic text-muted-foreground">{h.nota}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
