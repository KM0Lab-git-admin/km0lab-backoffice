import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { useLang } from "@/contexts/LangContext";
import { statsService } from "@/services/statsService";
import type { StatsRang } from "@/types/comerc";
import { Mail, Phone, TrendingDown, TrendingUp } from "lucide-react";

const RANGES: StatsRang[] = ["7d", "30d", "90d", "any"];
const DAY_KEYS = [
  "stats.day.mon",
  "stats.day.tue",
  "stats.day.wed",
  "stats.day.thu",
  "stats.day.fri",
  "stats.day.sat",
  "stats.day.sun",
] as const;

export default function EstadistiquesPage() {
  const { t, lang } = useLang();
  const [rang, setRang] = useState<StatsRang>("30d");

  const kpiQ = useQuery({ queryKey: ["stats", "kpi", rang], queryFn: () => statsService.getKPIs(rang) });
  const serieQ = useQuery({ queryKey: ["stats", "serie", rang], queryFn: () => statsService.getSerie(rang) });
  const promosQ = useQuery({ queryKey: ["stats", "promos"], queryFn: () => statsService.getPromos() });
  const heatQ = useQuery({ queryKey: ["stats", "heatmap"], queryFn: () => statsService.getHeatmap() });
  const visitorsQ = useQuery({ queryKey: ["stats", "visitors"], queryFn: () => statsService.getVisitants() });

  const anyError = kpiQ.error || serieQ.error || promosQ.error || heatQ.error || visitorsQ.error;

  if (anyError) {
    return (
      <ErrorState
        onRetry={() => {
          kpiQ.refetch();
          serieQ.refetch();
          promosQ.refetch();
          heatQ.refetch();
          visitorsQ.refetch();
        }}
      />
    );
  }

  const locale = lang === "es" ? "es-ES" : lang === "en" ? "en-GB" : "ca-ES";

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t("stats.title")}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">{t("stats.subtitle")}</p>
        </div>
        <div className="w-full md:w-56" aria-disabled="true">
          <Select value={rang} onValueChange={(v) => setRang(v as StatsRang)} disabled>
            <SelectTrigger className="grayscale opacity-60 cursor-not-allowed">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r} value={r}>
                  {t(`stats.range.${r}` as const)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiQ.isLoading || !kpiQ.data ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <KPICard
              label={t("stats.kpi.scans")}
              value={kpiQ.data.escanejosTotals.toLocaleString(locale)}
              delta={kpiQ.data.escanejosDeltaPct}
              deltaLabel={t("stats.vsPrev")}
            />
            <KPICard
              label={t("stats.kpi.uniqueVisitors")}
              value={kpiQ.data.visitantsUnics.toLocaleString(locale)}
              delta={kpiQ.data.visitantsUnicsDeltaPct}
              deltaLabel={t("stats.vsPrev")}
            />
            <MixCard
              label={t("stats.kpi.mix")}
              nous={kpiQ.data.nousVisitants}
              recurrents={kpiQ.data.recurrents}
              nousLabel={t("stats.mix.new")}
              recurrentsLabel={t("stats.mix.returning")}
            />
            <KPICard
              label={t("stats.kpi.points")}
              value={kpiQ.data.puntsAtorgats.toLocaleString(locale)}
              delta={kpiQ.data.puntsAtorgatsDeltaPct}
              deltaLabel={t("stats.vsPrev")}
            />
          </>
        )}
      </section>

      {/* Promotions performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-km0-blue-800">
            {t("stats.promos.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t("stats.promos.subtitle")}</p>
        </CardHeader>
        <CardContent>
          {promosQ.isLoading || !promosQ.data ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <PromoTable
              rows={promosQ.data}
              labels={{
                promo: t("stats.promos.col.promo"),
                views: t("stats.promos.col.views"),
                opens: t("stats.promos.col.opens"),
                state: t("stats.promos.col.state"),
                active: t("promos.state.active"),
                inactive: t("promos.state.inactive"),
              }}
              locale={locale}
            />
          )}
        </CardContent>
      </Card>

      {/* Visitors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-km0-blue-800">
            {t("stats.visitors.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t("stats.visitors.subtitle")}</p>
        </CardHeader>
        <CardContent>
          {visitorsQ.isLoading || !visitorsQ.data ? (
            <Skeleton className="h-56 w-full" />
          ) : visitorsQ.data.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("stats.visitors.empty")}
            </p>
          ) : (
            <VisitorsTable
              rows={visitorsQ.data}
              labels={{
                name: t("stats.visitors.col.name"),
                visits: t("stats.visitors.col.visits"),
                last: t("stats.visitors.col.last"),
                points: t("stats.visitors.col.points"),
                contact: t("stats.visitors.col.contact"),
                notShared: t("stats.visitors.notShared"),
              }}
              locale={locale}
            />
          )}
        </CardContent>
      </Card>

      {/* Evolution */}
      <Card className="[filter:grayscale(1)] opacity-70 pointer-events-none select-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-km0-blue-800 flex items-center gap-2">
            {t("stats.evolution.title")}
            <Badge variant="secondary">{t("placeholder.title")}</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t("stats.evolution.subtitle")}</p>
        </CardHeader>
        <CardContent>
          {serieQ.isLoading || !serieQ.data ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serieQ.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="data"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => {
                      const d = new Date(v);
                      return d.toLocaleDateString(locale, { day: "2-digit", month: "short" });
                    }}
                    minTickGap={24}
                  />
                  <YAxis tick={{ fontSize: 11 }} width={40} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, borderColor: "hsl(var(--border))" }}
                    labelFormatter={(v: string) =>
                      new Date(v).toLocaleDateString(locale, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="escanejos"
                    name={t("stats.series.scans")}
                    stroke="hsl(var(--primary))"
                    fill="url(#gScans)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitantsUnics"
                    name={t("stats.series.unique")}
                    stroke="hsl(var(--accent))"
                    fill="url(#gUnique)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card className="[filter:grayscale(1)] opacity-70 pointer-events-none select-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-km0-blue-800 flex items-center gap-2">
            {t("stats.heatmap.title")}
            <Badge variant="secondary">{t("placeholder.title")}</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t("stats.heatmap.subtitle")}</p>
        </CardHeader>
        <CardContent>
          {heatQ.isLoading || !heatQ.data ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <Heatmap
              cells={heatQ.data}
              dayLabels={DAY_KEYS.map((k) => t(k))}
              lowLabel={t("stats.heatmap.legendLow")}
              highLabel={t("stats.heatmap.legendHigh")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({
  label,
  value,
  delta,
  deltaLabel,
}: {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
}) {
  const positive = delta >= 0;
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-km0-blue-500">{label}</p>
        <p className="text-3xl font-black tracking-tight text-km0-blue-800">{value}</p>
        <div className="flex items-center gap-1 text-xs font-semibold">
          <span
            className={
              positive
                ? "inline-flex items-center gap-1 text-km0-green-600"
                : "inline-flex items-center gap-1 text-destructive"
            }
          >
            {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {positive ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">{deltaLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MixCard({
  label,
  nous,
  recurrents,
  nousLabel,
  recurrentsLabel,
}: {
  label: string;
  nous: number;
  recurrents: number;
  nousLabel: string;
  recurrentsLabel: string;
}) {
  const total = nous + recurrents || 1;
  const pctNew = Math.round((nous / total) * 100);
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-km0-blue-500">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-km0-blue-800">{pctNew}%</span>
          <span className="text-xs font-semibold text-muted-foreground">{nousLabel}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${pctNew}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {nousLabel}: <b className="text-foreground">{nous}</b>
          </span>
          <span>
            {recurrentsLabel}: <b className="text-foreground">{recurrents}</b>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function PromoTable({
  rows,
  labels,
  locale,
}: {
  rows: import("@/types/comerc").StatsPromoRendiment[];
  labels: { promo: string; views: string; opens: string; state: string; active: string; inactive: string };
  locale: string;
}) {
  const maxViews = Math.max(...rows.map((r) => r.vistes), 1);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{labels.promo}</TableHead>
            <TableHead className="w-[38%]">{labels.views}</TableHead>
            <TableHead className="text-right">{labels.opens}</TableHead>
            
            <TableHead className="text-right">{labels.state}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.promocioId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="inline-flex min-w-[3rem] items-center justify-center rounded-md bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 px-2 py-1 text-xs font-black text-km0-blue-800">
                    {r.etiqueta}
                  </span>
                  <span className="font-semibold text-km0-blue-800">{r.titol}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-full max-w-[220px] overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.round((r.vistes / maxViews) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {r.vistes.toLocaleString(locale)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">{r.obertes.toLocaleString(locale)}</TableCell>
              <TableCell className="text-right">
                <Badge variant={r.activa ? "default" : "secondary"}>
                  {r.activa ? labels.active : labels.inactive}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Heatmap({
  cells,
  dayLabels,
  lowLabel,
  highLabel,
}: {
  cells: import("@/types/comerc").StatsHeatmapCel[];
  dayLabels: string[];
  lowLabel: string;
  highLabel: string;
}) {
  const max = useMemo(() => Math.max(...cells.map((c) => c.escanejos), 1), [cells]);
  const grid: number[][] = useMemo(() => {
    const g = Array.from({ length: 7 }, () => Array(24).fill(0));
    cells.forEach((c) => (g[c.dia][c.hora] = c.escanejos));
    return g;
  }, [cells]);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="ml-8 grid grid-cols-24 gap-[2px] pb-1 text-[10px] text-muted-foreground" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-center">
                {h % 3 === 0 ? h : ""}
              </div>
            ))}
          </div>
          {grid.map((row, dia) => (
            <div key={dia} className="mb-[2px] flex items-center gap-2">
              <div className="w-6 text-right text-xs font-semibold text-km0-blue-500">
                {dayLabels[dia]}
              </div>
              <div className="grid flex-1 gap-[2px]" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                {row.map((v, h) => {
                  const intensity = v / max;
                  return (
                    <div
                      key={h}
                      title={`${dayLabels[dia]} ${h}:00 · ${v}`}
                      className="aspect-square rounded-[3px] bg-primary"
                      style={{ opacity: 0.08 + intensity * 0.92 }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((o) => (
          <span key={o} className="h-3 w-4 rounded-[3px] bg-primary" style={{ opacity: o }} />
        ))}
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

function VisitorsTable({
  rows,
  labels,
  locale,
}: {
  rows: import("@/types/comerc").StatsVisitant[];
  labels: { name: string; visits: string; last: string; points: string; contact: string; notShared: string };
  locale: string;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{labels.name}</TableHead>
            <TableHead className="text-right">{labels.visits}</TableHead>
            <TableHead>{labels.last}</TableHead>
            <TableHead className="text-right">{labels.points}</TableHead>
            <TableHead>{labels.contact}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((v) => {
            const last = new Date(v.ultimaVisita).toLocaleDateString(locale, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            return (
              <TableRow key={v.id}>
                <TableCell className="font-semibold text-km0-blue-800">{v.nom}</TableCell>
                <TableCell className="text-right tabular-nums">{v.visites}</TableCell>
                <TableCell className="text-muted-foreground">{last}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {v.puntsAcumulats.toLocaleString(locale)}
                </TableCell>
                <TableCell>
                  {v.contacteCompartit && (v.email || v.telefon) ? (
                    <div className="flex flex-col gap-0.5 text-xs">
                      {v.email ? (
                        <a
                          href={`mailto:${v.email}`}
                          className="inline-flex items-center gap-1 text-km0-blue-700 hover:underline"
                        >
                          <Mail className="h-3 w-3" />
                          {v.email}
                        </a>
                      ) : null}
                      {v.telefon ? (
                        <a
                          href={`tel:${v.telefon.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1 text-km0-blue-700 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {v.telefon}
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-xs italic text-muted-foreground">{labels.notShared}</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
