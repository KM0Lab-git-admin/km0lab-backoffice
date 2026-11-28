import { useQuery } from "@tanstack/react-query";
import { Users, Coins, Gift, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/adminService";
import { SignupOriginCard } from "@/components/backoffice/SignupOriginCard";
import { useLang } from "@/contexts/LangContext";
import type { AccioTipus } from "@/types/backoffice";
import type { MessageKey } from "@/lib/i18n";

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

const tipusKey: Record<AccioTipus, MessageKey> = {
  registre: "admin.accio.tipus.registre",
  escaneig: "admin.accio.tipus.escaneig",
  web: "admin.accio.tipus.web",
  esdeveniment: "admin.accio.tipus.esdeveniment",
  compra: "admin.accio.tipus.compra",
  altre: "admin.accio.tipus.altre",
};

export default function AdminResumPage() {
  const { t, lang } = useLang();
  const locale = lang === "en" ? "en-GB" : lang === "es" ? "es-ES" : "ca-ES";

  const statsQ = useQuery({ queryKey: ["admin", "resum", "stats"], queryFn: () => adminService.getResumStats() });
  const accionsQ = useQuery({ queryKey: ["admin", "resum", "accions"], queryFn: () => adminService.getAccionsTop() });
  const bescanvisQ = useQuery({ queryKey: ["admin", "resum", "bescanvis"], queryFn: () => adminService.getUltimsBescanvis() });

  const signupsQ = useQuery({ queryKey: ["admin", "resum", "signups"], queryFn: () => adminService.getSignupsByProvider() });

  const isError = statsQ.isError || accionsQ.isError || bescanvisQ.isError;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">{t("admin.resum.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("admin.resum.subtitle")}</p>
      </header>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>{t("admin.error.title")}</AlertTitle>
          <AlertDescription>{t("admin.error.desc")}</AlertDescription>
        </Alert>
      ) : null}

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-4 w-4" />}
          label={t("admin.kpi.usuarisActius")}
          hint={t("admin.kpi.usuarisActius.hint")}
          value={statsQ.data ? formatNumber(statsQ.data.usuarisActius, locale) : null}
          loading={statsQ.isLoading}
        />
        <KpiCard
          icon={<Coins className="h-4 w-4" />}
          label={t("admin.kpi.puntsCirculacio")}
          hint={t("admin.kpi.puntsCirculacio.hint")}
          value={statsQ.data ? formatNumber(statsQ.data.puntsCirculacio, locale) : null}
          loading={statsQ.isLoading}
        />
        <KpiCard
          icon={<Gift className="h-4 w-4" />}
          label={t("admin.kpi.bescanvis")}
          hint={t("admin.kpi.bescanvis.hint")}
          value={statsQ.data ? formatNumber(statsQ.data.bescanvisMes, locale) : null}
          loading={statsQ.isLoading}
        />
        <KpiCard
          icon={<Zap className="h-4 w-4" />}
          label={t("admin.kpi.accionsActives")}
          hint={
            statsQ.data
              ? t("admin.kpi.accionsActives.hint").replace("{total}", String(statsQ.data.accionsTotals))
              : t("admin.kpi.accionsActives.hint").replace("{total}", "—")
          }
          value={statsQ.data ? formatNumber(statsQ.data.accionsActives, locale) : null}
          loading={statsQ.isLoading}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Accions més utilitzades */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.accionsTop.title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("admin.accionsTop.subtitle")}</p>
          </CardHeader>
          <CardContent>
            {accionsQ.isLoading ? (
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.accionsTop.col.accio")}</TableHead>
                    <TableHead className="text-right">{t("admin.accionsTop.col.punts")}</TableHead>
                    <TableHead className="text-right">{t("admin.accionsTop.col.usos")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accionsQ.data?.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-md bg-muted text-base">
                            {a.emoji}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{a.nom}</p>
                            <Badge variant="secondary" className="mt-1 text-xs font-normal">
                              {t(tipusKey[a.tipus])}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatNumber(a.punts, locale)}</TableCell>
                      <TableCell className="text-right">{formatNumber(a.usos, locale)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Últims bescanvis */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.bescanvis.title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("admin.bescanvis.subtitle")}</p>
          </CardHeader>
          <CardContent>
            {bescanvisQ.isLoading ? (
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <ul className="divide-y">
                {bescanvisQ.data?.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 py-3">
                    <span aria-hidden className="grid h-9 w-9 place-items-center rounded-md bg-muted text-lg">
                      {b.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{b.recompensaNom}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {b.usuari} · {b.quan}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-km0-blue-700">
                      -{formatNumber(b.punts, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <SignupOriginCard
        loading={signupsQ.isLoading}
        error={signupsQ.isError}
        data={signupsQ.data}
        onRetry={() => signupsQ.refetch()}
      />
    </div>
  );
}

type KpiCardProps = {
  icon: React.ReactNode;
  label: string;
  hint: string;
  value: string | null;
  loading: boolean;
};

function KpiCard({ icon, label, hint, value, loading }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-km0-blue-50 text-km0-blue-700">{icon}</span>
          <span>{label}</span>
        </div>
        <div className="mt-3">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-black tracking-tight text-foreground">{value ?? "—"}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
