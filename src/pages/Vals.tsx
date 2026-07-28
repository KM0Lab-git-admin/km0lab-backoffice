import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Copy, Ticket, XCircle } from "lucide-react";

import { useLang } from "@/contexts/LangContext";
import type { Bescanvi } from "@/types/backoffice";
import { valsComercService } from "@/services/valsComercService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/backoffice/ErrorState";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function formatRef(id: string): string {
  const num = id.replace(/[^0-9]/g, "");
  return `BSC-${num.padStart(6, "0")}`;
}

function formatDate(iso: string | undefined, lang: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(
    lang === "en" ? "en-GB" : lang === "es" ? "es-ES" : "ca-ES",
    { day: "2-digit", month: "short", year: "numeric" },
  );
}

function formatEuros(n: number, lang: string): string {
  return new Intl.NumberFormat(
    lang === "en" ? "en-GB" : lang === "es" ? "es-ES" : "ca-ES",
    { style: "currency", currency: "EUR", maximumFractionDigits: 2 },
  ).format(n);
}

type Filtre = "tots" | "pendent" | "pagat";
type ValidacioResultat =
  | { ok: true; bescanvi: Bescanvi }
  | { ok: false; motiu: "no_trobat" | "ja_utilitzat" | "cancelat" };

export default function Vals() {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const [cobrament, setCobrament] = useState<Filtre>("tots");
  const [query, setQuery] = useState("");
  const [resultat, setResultat] = useState<ValidacioResultat | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        codi: z
          .string()
          .trim()
          .regex(/^\d{5}$/u, t("vals.validar.zod.length")),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codi: "" },
    mode: "onSubmit",
  });

  const resumQuery = useQuery({
    queryKey: ["vals", "resum"],
    queryFn: () => valsComercService.resum(),
  });

  const listQuery = useQuery({
    queryKey: ["vals", "list", { query, cobrament }],
    queryFn: () => valsComercService.list({ query, cobrament }),
  });

  const validar = useMutation({
    mutationFn: (codi: string) => valsComercService.validarCodi(codi),
    onSuccess: (r) => {
      setResultat(r);
      if (r.ok) {
        toast.success(t("vals.validar.toast.ok"));
        form.reset({ codi: "" });
        void qc.invalidateQueries({ queryKey: ["vals"] });
      }
    },
  });

  useEffect(() => {
    if (resultat && !resultat.ok) {
      // reset the code so the merchant can retry
      form.setValue("codi", "");
    }
  }, [resultat, form]);

  const kpiPendent = resumQuery.data?.importPendent ?? 0;
  const kpiCobrat = resumQuery.data?.importCobrat ?? 0;
  const kpiMes = resumQuery.data?.nMes ?? 0;

  const bescanvis = listQuery.data ?? [];
  const emptyBase = bescanvis.length === 0 && query === "" && cobrament === "tots";

  const copyRef = (id: string) => {
    void navigator.clipboard?.writeText(formatRef(id));
    toast.success(formatRef(id));
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Ticket className="h-5 w-5" aria-hidden />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("vals.title")}
          </h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("vals.subtitle")}
        </p>
      </header>

      {/* KPIs */}
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label={t("vals.title")}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("vals.kpi.mes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resumQuery.isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-semibold tabular-nums">{kpiMes}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("vals.kpi.pendent")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resumQuery.isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-semibold tabular-nums text-primary">
                {formatEuros(kpiPendent, lang)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("vals.kpi.cobrat")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resumQuery.isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-semibold tabular-nums">
                {formatEuros(kpiCobrat, lang)}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Validació */}
      <Card>
        <CardHeader>
          <CardTitle>{t("vals.validar.card.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              className="flex flex-col items-start gap-4"
              onSubmit={form.handleSubmit((values) => {
                setResultat(null);
                validar.mutate(values.codi);
              })}
            >
              <FormField
                control={form.control}
                name="codi"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <InputOTP
                        maxLength={5}
                        value={field.value}
                        onChange={field.onChange}
                        containerClassName="justify-start"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="h-14 w-12 text-xl" />
                          <InputOTPSlot index={1} className="h-14 w-12 text-xl" />
                          <InputOTPSlot index={2} className="h-14 w-12 text-xl" />
                          <InputOTPSlot index={3} className="h-14 w-12 text-xl" />
                          <InputOTPSlot index={4} className="h-14 w-12 text-xl" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  disabled={validar.isPending}
                  className="min-w-40"
                >
                  {t("vals.validar.action")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset({ codi: "" });
                    setResultat(null);
                  }}
                >
                  {t("vals.validar.reset")}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {t("vals.validar.card.help")}
                </p>
              </div>
            </form>
          </Form>

          {resultat?.ok ? (
            <div className="flex items-start gap-3 rounded-md border border-primary/20 bg-primary/5 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" aria-hidden />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">
                  {t("vals.validar.ok.title")}
                </p>
                <p className="text-muted-foreground">
                  {t("vals.validar.ok.body")
                    .replace(
                      "{recompensa}",
                      `${resultat.bescanvi.recompensaNom} (${resultat.bescanvi.import ?? ""})`,
                    )
                    .replace("{veí}", resultat.bescanvi.usuariNom)}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge variant="outline" className="font-mono">
                    {formatRef(resultat.bescanvi.id)}
                  </Badge>
                  <Badge variant="secondary" className="font-mono tracking-widest">
                    {resultat.bescanvi.codi}
                  </Badge>
                </div>
              </div>
            </div>
          ) : null}

          {resultat && !resultat.ok ? (
            <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4">
              <XCircle className="mt-0.5 h-5 w-5 flex-none text-destructive" aria-hidden />
              <p className="text-sm text-foreground">
                {resultat.motiu === "no_trobat"
                  ? t("vals.validar.err.no_trobat")
                  : resultat.motiu === "ja_utilitzat"
                    ? t("vals.validar.err.ja_utilitzat")
                    : t("vals.validar.err.cancelat")}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Historial */}
      <Card>
        <CardHeader className="gap-4">
          <CardTitle>{t("vals.historial.title")}</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              className="sm:max-w-sm"
              placeholder={t("vals.historial.search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t("vals.historial.search")}
            />
            <Tabs
              value={cobrament}
              onValueChange={(v) => setCobrament(v as Filtre)}
            >
              <TabsList>
                <TabsTrigger value="tots">
                  {t("vals.historial.filter.all")}
                </TabsTrigger>
                <TabsTrigger value="pendent">
                  {t("vals.historial.filter.pendent")}
                </TabsTrigger>
                <TabsTrigger value="pagat">
                  {t("vals.historial.filter.pagat")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {listQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : listQuery.isError ? (
            <ErrorState onRetry={() => listQuery.refetch()} />
          ) : bescanvis.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
              {emptyBase
                ? t("vals.historial.empty")
                : t("vals.historial.emptyFiltres")}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("vals.historial.col.ref")}</TableHead>
                      <TableHead>{t("vals.historial.col.codi")}</TableHead>
                      <TableHead>{t("vals.historial.col.data")}</TableHead>
                      <TableHead>{t("vals.historial.col.vei")}</TableHead>
                      <TableHead className="text-right">
                        {t("vals.historial.col.import")}
                      </TableHead>
                      <TableHead>{t("vals.historial.col.cobrament")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bescanvis.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => copyRef(b.id)}
                            className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                          >
                            {formatRef(b.id)}
                            <Copy className="h-3 w-3" aria-hidden />
                          </button>
                        </TableCell>
                        <TableCell className="font-mono tracking-widest">
                          {b.codi ?? "—"}
                        </TableCell>
                        <TableCell>{formatDate(b.dataUs, lang)}</TableCell>
                        <TableCell>{b.usuariNom}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {b.import ?? ""}
                        </TableCell>
                        <TableCell>
                          {b.pagamentEstat === "pagat" ? (
                            <Badge variant="secondary">
                              {t("vals.cobrament.pagat")}
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              {t("vals.cobrament.pendent")}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                {bescanvis.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => copyRef(b.id)}
                          className="inline-flex items-center gap-1 font-mono text-xs text-primary"
                        >
                          {formatRef(b.id)}
                          <Copy className="h-3 w-3" aria-hidden />
                        </button>
                        <p className="text-sm font-medium">{b.usuariNom}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(b.dataUs, lang)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold tabular-nums">
                          {b.import ?? ""}
                        </p>
                        {b.pagamentEstat === "pagat" ? (
                          <Badge variant="secondary">
                            {t("vals.cobrament.pagat")}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {t("vals.cobrament.pendent")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 font-mono text-sm tracking-widest text-muted-foreground">
                      {b.codi ?? "—"}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
