import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Coins, PackageCheck, QrCode, Search, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { pagamentsService } from "@/services/pagamentsService";
import { ErrorState } from "@/components/backoffice/ErrorState";
import type {
  Bescanvi,
  BescanviEstat,
  BescanviFiltres,
  DeuteComerc,
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

const PAGAMENT_OPTIONS: Array<"pendent" | "pagat" | "no_aplica"> = [
  "pendent",
  "pagat",
  "no_aplica",
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

function formatEuro(value: number, lang: string): string {
  try {
    return new Intl.NumberFormat(localeFor(lang), {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} €`;
  }
}

function formatRef(id: string): string {
  const match = id.match(/(\d+)\s*$/);
  const num = match ? match[1] : id;
  return `BSC-${num.padStart(6, "0")}`;
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

function PagamentBadge({ b }: { b: Bescanvi }) {
  const { t } = useLang();
  const aplica = b.flux === "val_qr" && b.estat === "utilitzat";
  if (!aplica) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  if (b.pagamentEstat === "pagat") {
    return (
      <Badge
        variant="outline"
        className="border-transparent bg-km0-teal-500/15 font-semibold text-km0-teal-500"
      >
        {t("bescanvis.pagament.pagat")}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-transparent bg-km0-yellow-300/25 font-semibold text-km0-blue-800"
    >
      {t("bescanvis.pagament.pendent")}
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

  const [tab, setTab] = useState<"bescanvis" | "lliuraments" | "pagaments">("bescanvis");
  const [query, setQuery] = useState("");
  const [tipus, setTipus] = useState<RecompensaTipus | "tots">("tots");
  const [estat, setEstat] = useState<BescanviEstat | "tots">("tots");
  const [comercId, setComercId] = useState<string | "tots">("tots");
  const [pagament, setPagament] = useState<
    "tots" | "pendent" | "pagat" | "no_aplica"
  >("tots");
  const [desde, setDesde] = useState("");
  const [fins, setFins] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nota, setNota] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  const bescanvis = listQ.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bescanvis.filter((b) => {
      if (q && !b.usuariNom.toLowerCase().includes(q) && !formatRef(b.id).toLowerCase().includes(q)) return false;
      if (tipus !== "tots" && b.recompensaTipus !== tipus) return false;
      if (estat !== "tots" && b.estat !== estat) return false;
      if (comercId !== "tots" && b.comercId !== comercId) return false;
      if (pagament !== "tots") {
        const aplica = b.flux === "val_qr" && b.estat === "utilitzat";
        if (pagament === "no_aplica" && aplica) return false;
        if (pagament === "pendent" && (!aplica || b.pagamentEstat !== "pendent")) return false;
        if (pagament === "pagat" && (!aplica || b.pagamentEstat !== "pagat")) return false;
      }
      if (desde && b.dataSolicitud < desde) return false;
      if (fins && b.dataSolicitud > `${fins}T23:59:59`) return false;
      return true;
    });
  }, [bescanvis, query, tipus, estat, comercId, pagament, desde, fins]);

  const selected = selectedId ? bescanvis.find((b) => b.id === selectedId) ?? null : null;
  const poblacioNom = meQ.data?.poblacioNom ?? "";

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "bescanvis"] });
    qc.invalidateQueries({ queryKey: ["admin", "pagaments"] });
  };

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
    !!query ||
    tipus !== "tots" ||
    estat !== "tots" ||
    comercId !== "tots" ||
    pagament !== "tots" ||
    !!desde ||
    !!fins;

  function clearFilters() {
    setQuery("");
    setTipus("tots");
    setEstat("tots");
    setComercId("tots");
    setPagament("tots");
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

      <Tabs value={tab} onValueChange={(v) => setTab(v as "bescanvis" | "lliuraments" | "pagaments")}>
        <TabsList>
          <TabsTrigger value="bescanvis">{t("bescanvis.tabs.bescanvis")}</TabsTrigger>
          <TabsTrigger value="lliuraments">{t("bescanvis.tabs.lliuraments")}</TabsTrigger>
          <TabsTrigger value="pagaments">{t("bescanvis.tabs.pagaments")}</TabsTrigger>
        </TabsList>

        <TabsContent value="bescanvis" className="mt-6 flex flex-col gap-6">
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
                <KpiTile label={t("bescanvis.kpi.total")} value={String(kpiTotal)} />
                <KpiTile label={t("bescanvis.kpi.pendents")} value={String(kpiPendents)} />
                <KpiTile label={t("bescanvis.kpi.completats")} value={String(kpiCompletats)} />
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <Select
                    value={pagament}
                    onValueChange={(v) =>
                      setPagament(v as "tots" | "pendent" | "pagat" | "no_aplica")
                    }
                  >
                    <SelectTrigger aria-label={t("bescanvis.filter.pagament")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tots">{t("bescanvis.filter.allPagaments")}</SelectItem>
                      {PAGAMENT_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p === "no_aplica"
                            ? t("bescanvis.filter.pagamentNoAplica")
                            : t(`bescanvis.pagament.${p}` as MessageKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          <TableHead>{t("bescanvis.col.referencia")}</TableHead>
                          <TableHead>{t("bescanvis.col.usuari")}</TableHead>
                          <TableHead>{t("bescanvis.col.premi")}</TableHead>
                          <TableHead className="text-right">
                            {t("bescanvis.col.punts")}
                          </TableHead>
                          <TableHead>{t("bescanvis.col.dataSolicitud")}</TableHead>
                          <TableHead>{t("bescanvis.col.estat")}</TableHead>
                          <TableHead>{t("bescanvis.col.comerc")}</TableHead>
                          <TableHead>{t("bescanvis.col.dataUs")}</TableHead>
                          <TableHead>{t("bescanvis.col.pagament")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((b) => (
                          <TableRow
                            key={b.id}
                            onClick={() => setSelectedId(b.id)}
                            className="cursor-pointer"
                          >
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {formatRef(b.id)}
                            </TableCell>
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
                            <TableCell>
                              <PagamentBadge b={b} />
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
                            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                              {formatRef(b.id)}
                            </p>
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
                          <PagamentBadge b={b} />
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
        </TabsContent>

        <TabsContent value="lliuraments" className="mt-6">
          <LliuramentsTab
            bescanvis={bescanvis}
            loading={listQ.isLoading}
            error={!!listQ.error}
            onRetry={() => listQ.refetch()}
            onOpen={setSelectedId}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="pagaments" className="mt-6">
          <PagamentsTab lang={lang} />
        </TabsContent>
      </Tabs>

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

function KpiTile({ label, value }: { label: string; value: string }) {
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
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(formatRef(b.id));
                toast.success(t("bescanvis.copy.ok"));
              }}
              className="mb-1 inline-flex items-center gap-1 rounded-md border border-dashed px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground hover:bg-muted"
              aria-label={t("bescanvis.detall.referencia")}
              title={t("bescanvis.detall.referenciaAjuda")}
            >
              {formatRef(b.id)}
            </button>
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

        {b.flux === "val_qr" && b.estat === "utilitzat" ? (
          <section className="flex flex-col gap-2 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{t("bescanvis.detall.pagament")}</p>
              <PagamentBadge b={b} />
            </div>
            {b.pagamentEstat === "pagat" ? (
              <div className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                <InfoRow
                  label={t("bescanvis.detall.dataPagament")}
                  value={formatDateTime(b.dataPagament, lang)}
                />
                <InfoRow
                  label={t("bescanvis.detall.pagamentId")}
                  value={b.pagamentId ?? "—"}
                />
              </div>
            ) : null}
          </section>
        ) : null}

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

function PagamentsTab({ lang }: { lang: string }) {
  const { t } = useLang();
  const [openComerc, setOpenComerc] = useState<DeuteComerc | null>(null);

  const deutesQ = useQuery({
    queryKey: ["admin", "pagaments", "deutes"],
    queryFn: () => pagamentsService.listDeutes(),
  });
  const pagamentsQ = useQuery({
    queryKey: ["admin", "pagaments", "list"],
    queryFn: () => pagamentsService.list(),
  });

  if (deutesQ.isLoading || pagamentsQ.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    );
  }
  if (deutesQ.error) {
    return <ErrorState onRetry={() => deutesQ.refetch()} />;
  }

  const deutes = deutesQ.data ?? [];
  const pagaments = pagamentsQ.data ?? [];

  const totalPendent = deutes.reduce((acc, d) => acc + d.importPendent, 0);
  const comercosAmbDeute = deutes.filter((d) => d.importPendent > 0).length;
  const now = new Date();
  const pagatMes = pagaments
    .filter((p) => {
      const d = new Date(p.data);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((acc, p) => acc + p.importTotal, 0);

  const withDebt = deutes.filter((d) => d.importPendent > 0);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile label={t("pagaments.kpi.pendent")} value={formatEuro(totalPendent, lang)} />
        <KpiTile
          label={t("pagaments.kpi.comercos")}
          value={String(comercosAmbDeute)}
        />
        <KpiTile label={t("pagaments.kpi.pagatMes")} value={formatEuro(pagatMes, lang)} />
      </section>

      {deutes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Coins className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">{t("pagaments.empty.title")}</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {t("pagaments.empty.subtitle")}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("pagaments.col.comerc")}</TableHead>
                  <TableHead className="text-right">{t("pagaments.col.pendents")}</TableHead>
                  <TableHead className="text-right">
                    {t("pagaments.col.importPendent")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("pagaments.col.importPagat")}
                  </TableHead>
                  <TableHead className="text-right">{t("pagaments.col.accions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deutes.map((d) => (
                  <TableRow key={d.comercId}>
                    <TableCell className="font-semibold text-km0-blue-800">
                      {d.comercNom}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {d.nBescanvisPendents}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {formatEuro(d.importPendent, lang)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatEuro(d.importPagatHistoric, lang)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setOpenComerc(d)}
                        disabled={d.importPendent === 0}
                      >
                        {t("pagaments.action.veureILiquidar")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {deutes.map((d) => (
              <div
                key={d.comercId}
                className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-km0-blue-800">{d.comercNom}</p>
                  <span className="text-xs text-muted-foreground">
                    {d.nBescanvisPendents} {t("pagaments.col.pendents").toLowerCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/40 px-3 py-2 text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {t("pagaments.col.importPendent")}
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-km0-blue-800">
                      {formatEuro(d.importPendent, lang)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {t("pagaments.col.importPagat")}
                    </p>
                    <p className="text-sm font-medium tabular-nums text-muted-foreground">
                      {formatEuro(d.importPagatHistoric, lang)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenComerc(d)}
                  disabled={d.importPendent === 0}
                >
                  {t("pagaments.action.veureILiquidar")}
                </Button>
              </div>
            ))}
          </div>

          {withDebt.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-card p-6 text-center text-xs text-muted-foreground">
              {t("pagaments.empty.title")}
            </div>
          ) : null}
        </>
      )}

      <Sheet
        open={!!openComerc}
        onOpenChange={(o) => {
          if (!o) setOpenComerc(null);
        }}
      >
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-xl">
          {openComerc ? (
            <LiquidacioSheet deute={openComerc} lang={lang} onClose={() => setOpenComerc(null)} />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function LiquidacioSheet({
  deute,
  lang,
  onClose,
}: {
  deute: DeuteComerc;
  lang: string;
  onClose: () => void;
}) {
  const { t } = useLang();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [nota, setNota] = useState("");
  const [confirm, setConfirm] = useState(false);

  const pendentsQ = useQuery({
    queryKey: ["admin", "pagaments", "pendents", deute.comercId],
    queryFn: () => pagamentsService.listBescanvisPendents(deute.comercId),
  });
  const historialQ = useQuery({
    queryKey: ["admin", "pagaments", "historial", deute.comercId],
    queryFn: () => pagamentsService.listPagamentsComerc(deute.comercId),
  });

  const registrarMut = useMutation({
    mutationFn: () =>
      pagamentsService.registrar({
        comercId: deute.comercId,
        comercNom: deute.comercNom,
        bescanviIds: Array.from(selected),
        nota: nota || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "bescanvis"] });
      qc.invalidateQueries({ queryKey: ["admin", "pagaments"] });
      toast.success(t("pagaments.toast.registrat"));
      setSelected(new Set());
      setNota("");
      setConfirm(false);
      onClose();
    },
    onError: () => toast.error(t("pagaments.toast.error")),
  });

  const pendents = pendentsQ.data ?? [];
  const historial = historialQ.data ?? [];

  const totalSel = pendents
    .filter((b) => selected.has(b.id))
    .reduce((acc, b) => acc + (b.importPagatNum ?? 0), 0);
  const allSelected = pendents.length > 0 && pendents.every((b) => selected.has(b.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(pendents.map((b) => b.id)));
  }

  return (
    <>
      <SheetHeader className="text-left">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 text-km0-blue-800">
            <Coins className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <SheetTitle>{deute.comercNom}</SheetTitle>
            <SheetDescription>{t("pagaments.sheet.subtitle")}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
        {pendentsQ.isLoading ? (
          <Skeleton className="h-24" />
        ) : pendents.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
            {t("pagaments.sheet.empty")}
          </div>
        ) : (
          <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label={t("pagaments.sheet.selectAll")}
                />
                <span>{t("pagaments.sheet.selectAll")}</span>
              </label>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("pagaments.sheet.totalSeleccionat")}
                </p>
                <p className="text-lg font-bold tabular-nums text-km0-blue-800">
                  {formatEuro(totalSel, lang)}
                </p>
              </div>
            </div>
            <ul className="flex flex-col divide-y rounded-lg border bg-background">
              {pendents.map((b) => (
                <li key={b.id} className="flex items-center gap-3 px-3 py-2.5">
                  <Checkbox
                    checked={selected.has(b.id)}
                    onCheckedChange={() => toggle(b.id)}
                    aria-label={`${b.recompensaNom} · ${b.usuariNom}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{b.recompensaNom}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      <span className="font-mono">{formatRef(b.id)}</span> · {b.usuariNom} · {formatDateTime(b.dataUs, lang)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-km0-blue-800">
                    {formatEuro(b.importPagatNum ?? 0, lang)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pag-nota" className="text-xs">
                {t("pagaments.sheet.nota")}
              </Label>
              <Textarea
                id="pag-nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder={t("pagaments.sheet.notaPlaceholder")}
                rows={2}
              />
            </div>
          </section>
        )}

        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{t("pagaments.sheet.historial")}</p>
          {historialQ.isLoading ? (
            <Skeleton className="h-16" />
          ) : historial.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-card p-4 text-center text-sm text-muted-foreground">
              {t("pagaments.sheet.historialEmpty")}
            </div>
          ) : (
            <ul className="flex flex-col divide-y rounded-lg border bg-card">
              {historial.map((p) => (
                <li key={p.id} className="flex flex-col gap-1 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-km0-blue-800">
                      {formatEuro(p.importTotal, lang)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(p.data, lang)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("pagaments.sheet.pagamentDe").replace(
                      "{n}",
                      String(p.bescanviIds.length),
                    )}
                    {p.nota ? ` · ${p.nota}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.close")}
        </Button>
        <Button
          type="button"
          onClick={() => setConfirm(true)}
          disabled={selected.size === 0 || registrarMut.isPending}
        >
          {t("pagaments.sheet.marcarPagat")}
        </Button>
      </div>

      <AlertDialog
        open={confirm}
        onOpenChange={(o) => {
          if (!o) setConfirm(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("pagaments.confirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("pagaments.confirm.body")
                .replace("{n}", String(selected.size))
                .replace("{total}", formatEuro(totalSel, lang))}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => registrarMut.mutate()}>
              {t("pagaments.confirm.action")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function LliuramentsTab({
  bescanvis,
  loading,
  error,
  onRetry,
  onOpen,
  lang,
}: {
  bescanvis: Bescanvi[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onOpen: (id: string) => void;
  lang: string;
}) {
  const { t } = useLang();
  const qc = useQueryClient();

  const [query, setQuery] = useState("");
  const [tipus, setTipus] = useState<"tots" | "marxandatge" | "experiencia">("tots");
  const [estat, setEstat] = useState<BescanviEstat | "tots">("tots");
  const [desde, setDesde] = useState("");
  const [fins, setFins] = useState("");

  const advanceMut = useMutation({
    mutationFn: (input: { id: string; estat: BescanviEstat }) =>
      bescanvisService.updateEstat(input.id, input.estat),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "bescanvis"] });
      toast.success(t("bescanvis.toast.estatUpdated"));
    },
    onError: () => toast.error(t("bescanvis.toast.error")),
  });

  const lliuraments = useMemo(
    () => bescanvis.filter((b) => b.flux === "lliurament"),
    [bescanvis],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lliuraments.filter((b) => {
      if (
        q &&
        !b.usuariNom.toLowerCase().includes(q) &&
        !b.recompensaNom.toLowerCase().includes(q) &&
        !formatRef(b.id).toLowerCase().includes(q)
      )
        return false;
      if (tipus !== "tots" && b.recompensaTipus !== tipus) return false;
      if (estat !== "tots" && b.estat !== estat) return false;
      if (desde && b.dataSolicitud < desde) return false;
      if (fins && b.dataSolicitud > `${fins}T23:59:59`) return false;
      return true;
    });
  }, [lliuraments, query, tipus, estat, desde, fins]);

  const kpiPerPreparar = useMemo(
    () =>
      lliuraments.filter(
        (b) => b.estat === "solicitat" || b.estat === "pendent_preparacio",
      ).length,
    [lliuraments],
  );
  const kpiPerEntregar = useMemo(
    () =>
      lliuraments.filter(
        (b) => b.estat === "preparat" || b.estat === "pendent_recollida",
      ).length,
    [lliuraments],
  );
  const kpiEntregatsMes = useMemo(() => {
    const now = new Date();
    return lliuraments.filter((b) => {
      if (b.estat !== "entregat" || !b.dataLliurament) return false;
      const d = new Date(b.dataLliurament);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }, [lliuraments]);

  const filtresActius =
    !!query || tipus !== "tots" || estat !== "tots" || !!desde || !!fins;

  function clearFilters() {
    setQuery("");
    setTipus("tots");
    setEstat("tots");
    setDesde("");
    setFins("");
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    );
  }
  if (error) return <ErrorState onRetry={onRetry} />;

  if (lliuraments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <PackageCheck className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold">{t("lliuraments.empty.title")}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {t("lliuraments.empty.subtitle")}
        </p>
      </div>
    );
  }

  const LLIURAMENT_ESTATS: BescanviEstat[] = [
    "solicitat",
    "pendent_preparacio",
    "preparat",
    "pendent_recollida",
    "entregat",
    "cancel·lat",
  ];

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        {t("lliuraments.subtitle")}
      </p>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile
          label={t("lliuraments.kpi.perPreparar")}
          value={String(kpiPerPreparar)}
        />
        <KpiTile
          label={t("lliuraments.kpi.perEntregar")}
          value={String(kpiPerEntregar)}
        />
        <KpiTile
          label={t("lliuraments.kpi.entregatsMes")}
          value={String(kpiEntregatsMes)}
        />
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
          <Select
            value={tipus}
            onValueChange={(v) => setTipus(v as "tots" | "marxandatge" | "experiencia")}
          >
            <SelectTrigger aria-label={t("bescanvis.filter.tipus")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tots">{t("lliuraments.filter.allTipus")}</SelectItem>
              <SelectItem value="marxandatge">{t("bescanvis.tipus.marxandatge")}</SelectItem>
              <SelectItem value="experiencia">{t("bescanvis.tipus.experiencia")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={estat} onValueChange={(v) => setEstat(v as BescanviEstat | "tots")}>
            <SelectTrigger aria-label={t("bescanvis.filter.estat")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tots">{t("bescanvis.filter.allEstats")}</SelectItem>
              {LLIURAMENT_ESTATS.map((e) => (
                <SelectItem key={e} value={e}>
                  {t(estatKey(e))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lliur-desde" className="text-xs">
              {t("bescanvis.filter.desde")}
            </Label>
            <Input
              id="lliur-desde"
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lliur-fins" className="text-xs">
              {t("bescanvis.filter.fins")}
            </Label>
            <Input
              id="lliur-fins"
              type="date"
              value={fins}
              onChange={(e) => setFins(e.target.value)}
            />
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          {t("bescanvis.filter.noResults")}
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("bescanvis.col.referencia")}</TableHead>
                  <TableHead>{t("bescanvis.col.usuari")}</TableHead>
                  <TableHead>{t("lliuraments.col.item")}</TableHead>
                  <TableHead>{t("bescanvis.col.dataSolicitud")}</TableHead>
                  <TableHead>{t("bescanvis.col.estat")}</TableHead>
                  <TableHead className="text-right">
                    {t("lliuraments.col.acciorapida")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => {
                  const next = nextLliuramentEstat(b.estat);
                  const isFinal = isFinalEstat(b.estat);
                  return (
                    <TableRow key={b.id}>
                      <TableCell
                        className="cursor-pointer font-mono text-xs text-muted-foreground"
                        onClick={() => onOpen(b.id)}
                      >
                        {formatRef(b.id)}
                      </TableCell>
                      <TableCell
                        className="cursor-pointer font-semibold text-km0-blue-800"
                        onClick={() => onOpen(b.id)}
                      >
                        {b.usuariNom}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => onOpen(b.id)}>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">{b.recompensaNom}</span>
                          <TipusBadge tipus={b.recompensaTipus} />
                        </div>
                      </TableCell>
                      <TableCell
                        className="cursor-pointer text-xs text-muted-foreground"
                        onClick={() => onOpen(b.id)}
                      >
                        {formatDate(b.dataSolicitud, lang)}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => onOpen(b.id)}>
                        <EstatBadge estat={b.estat} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {next && !isFinal ? (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                advanceMut.mutate({ id: b.id, estat: next })
                              }
                              disabled={advanceMut.isPending}
                            >
                              {t("lliuraments.action.marcar").replace(
                                "{estat}",
                                t(estatKey(next)),
                              )}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => onOpen(b.id)}
                            >
                              {t("lliuraments.action.veureDetall")}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((b) => {
              const next = nextLliuramentEstat(b.estat);
              const isFinal = isFinalEstat(b.estat);
              return (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(b.id)}
                    className="flex flex-col gap-2 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                          {formatRef(b.id)}
                        </p>
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
                        {formatDate(b.dataSolicitud, lang)}
                      </span>
                    </div>
                  </button>
                  {next && !isFinal ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => advanceMut.mutate({ id: b.id, estat: next })}
                      disabled={advanceMut.isPending}
                    >
                      {t("lliuraments.action.marcar").replace(
                        "{estat}",
                        t(estatKey(next)),
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onOpen(b.id)}
                    >
                      {t("lliuraments.action.veureDetall")}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
