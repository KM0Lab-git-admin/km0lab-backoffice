import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertTriangle,
  Building2,
  Coins,
  DownloadCloud,
  Languages,
  Palette,
  PowerOff,
  RefreshCcw,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { configService } from "@/services/configService";
import { useSessionStore } from "@/stores/useSessionStore";
import type {
  EntitatTipus,
  IdiomaDefecte,
  PoblacioConfigInput,
} from "@/types/backoffice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/backoffice/ImageUploader";
import { ErrorState } from "@/components/backoffice/ErrorState";

const buildSchema = (t: (k: never) => string) =>
  z
    .object({
      entitatNom: z.string().trim().min(1, t("config.error.entitatRequired" as never)),
      entitatTipus: z.enum(["ajuntament", "privada"]),
      contacteEmail: z
        .string()
        .trim()
        .min(1, t("config.error.emailRequired" as never))
        .email(t("config.error.emailInvalid" as never)),
      responsable: z.string().trim().min(1, t("config.error.responsableRequired" as never)),
      logoUrl: z.string().optional(),
      puntsPerEuro: z.coerce
        .number({ invalid_type_error: t("config.error.puntsPerEuro" as never) })
        .positive(t("config.error.puntsPerEuro" as never)),
      noCaduquen: z.boolean(),
      caducitatMesos: z.coerce
        .number({ invalid_type_error: t("config.error.caducitat" as never) })
        .int()
        .min(1, t("config.error.caducitat" as never))
        .optional()
        .or(z.literal(undefined)),
      puntsPerVisitaDefecte: z.coerce
        .number({ invalid_type_error: t("config.error.puntsVisita" as never) })
        .int()
        .min(0, t("config.error.puntsVisita" as never))
        .optional()
        .or(z.literal(undefined)),
      idiomaDefecte: z.enum(["ca", "es", "en"]),
    })
    .refine(
      (v) => v.noCaduquen || (typeof v.caducitatMesos === "number" && v.caducitatMesos >= 1),
      { path: ["caducitatMesos"], message: t("config.error.caducitat" as never) },
    );

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export default function ConfiguracioPage() {
  const { t } = useLang();
  const qc = useQueryClient();
  const poblacioId = useSessionStore((s) => s.poblacioId);

  const configQ = useQuery({
    queryKey: ["admin", "config", poblacioId],
    queryFn: () => configService.get(poblacioId),
  });

  const schema = buildSchema(t as unknown as (k: never) => string);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      entitatNom: "",
      entitatTipus: "ajuntament",
      contacteEmail: "",
      responsable: "",
      logoUrl: undefined,
      puntsPerEuro: 200,
      noCaduquen: false,
      caducitatMesos: 12,
      puntsPerVisitaDefecte: 10,
      idiomaDefecte: "ca",
    },
  });

  useEffect(() => {
    const c = configQ.data;
    if (!c) return;
    form.reset({
      entitatNom: c.entitatNom,
      entitatTipus: c.entitatTipus,
      contacteEmail: c.contacteEmail,
      responsable: c.responsable,
      logoUrl: c.logoUrl,
      puntsPerEuro: c.puntsPerEuro,
      noCaduquen: c.caducitatMesos === undefined,
      caducitatMesos: c.caducitatMesos ?? 12,
      puntsPerVisitaDefecte: c.puntsPerVisitaDefecte,
      idiomaDefecte: c.idiomaDefecte,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configQ.data]);

  const saveMut = useMutation({
    mutationFn: (input: PoblacioConfigInput) => configService.update(poblacioId, input),
    onSuccess: () => {
      toast.success(t("config.saved"));
      qc.invalidateQueries({ queryKey: ["admin", "config", poblacioId] });
      qc.invalidateQueries({ queryKey: ["admin", "me"] });
    },
    onError: () => toast.error(t("config.saveError")),
  });

  const exportMut = useMutation({
    mutationFn: () => configService.exportData(poblacioId),
    onSuccess: () => toast.success(t("config.perill.export.done")),
  });
  const regenMut = useMutation({
    mutationFn: () => configService.regenerateCredentials(poblacioId),
    onSuccess: () => toast.success(t("config.perill.regen.done")),
  });
  const deactivateMut = useMutation({
    mutationFn: () => configService.deactivateProgram(poblacioId),
    onSuccess: () => toast.success(t("config.perill.deactivate.done")),
  });

  const noCaduquen = form.watch("noCaduquen");
  const puntsPerEuro = form.watch("puntsPerEuro");

  const onSubmit = form.handleSubmit((values) => {
    const input: PoblacioConfigInput = {
      entitatNom: values.entitatNom.trim(),
      entitatTipus: values.entitatTipus as EntitatTipus,
      contacteEmail: values.contacteEmail.trim(),
      responsable: values.responsable.trim(),
      logoUrl: values.logoUrl,
      puntsPerEuro: Number(values.puntsPerEuro),
      caducitatMesos: values.noCaduquen ? undefined : Number(values.caducitatMesos),
      puntsPerVisitaDefecte:
        values.puntsPerVisitaDefecte === undefined ||
        Number.isNaN(Number(values.puntsPerVisitaDefecte))
          ? undefined
          : Number(values.puntsPerVisitaDefecte),
      idiomaDefecte: values.idiomaDefecte as IdiomaDefecte,
    };
    saveMut.mutate(input);
  });

  if (configQ.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (configQ.isError) {
    return <ErrorState onRetry={() => configQ.refetch()} />;
  }

  const cfg = configQ.data!;
  const exemplePunts = Math.max(1, Math.round(Number(puntsPerEuro) * 5));

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t("config.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("config.subtitle")}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dades de la població / entitat */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{t("config.dades.title")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("config.dades.poblacio")}</Label>
              <Input value={cfg.poblacioNom} readOnly disabled />
              <p className="text-xs text-muted-foreground">{t("config.dades.poblacioHint")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entitatNom">{t("config.dades.entitat")}</Label>
              <Input
                id="entitatNom"
                placeholder={t("config.dades.entitatPlaceholder")}
                {...form.register("entitatNom")}
              />
              {form.formState.errors.entitatNom ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.entitatNom.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>{t("config.dades.tipus")}</Label>
              <Select
                value={form.watch("entitatTipus")}
                onValueChange={(v) => form.setValue("entitatTipus", v as EntitatTipus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ajuntament">
                    {t("config.dades.tipus.ajuntament")}
                  </SelectItem>
                  <SelectItem value="privada">{t("config.dades.tipus.privada")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacteEmail">{t("config.dades.email")}</Label>
              <Input
                id="contacteEmail"
                type="email"
                autoComplete="email"
                {...form.register("contacteEmail")}
              />
              {form.formState.errors.contacteEmail ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.contacteEmail.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsable">{t("config.dades.responsable")}</Label>
              <Input id="responsable" {...form.register("responsable")} />
              {form.formState.errors.responsable ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.responsable.message}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Marca */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{t("config.marca.title")}</CardTitle>
            </div>
            <CardDescription>{t("config.marca.logoHint")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              value={form.watch("logoUrl")}
              onChange={(v) => form.setValue("logoUrl", v)}
              aspect="square"
              label={t("config.marca.logo")}
              hint={t("config.marca.logoHint")}
              recommendation={t("config.marca.logoReco")}
              placeholderLabel={t("config.marca.logoPlaceholder")}
            />
          </CardContent>
        </Card>

        {/* Regles de punts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{t("config.regles.title")}</CardTitle>
            </div>
            <CardDescription>{t("config.regles.equivalenciaHint")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="puntsPerEuro">{t("config.regles.puntsPerEuro")}</Label>
              <Input
                id="puntsPerEuro"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                {...form.register("puntsPerEuro")}
              />
              <p className="text-xs text-muted-foreground">
                {t("config.regles.exemple")
                  .replace("{punts}", String(exemplePunts))
                  .replace("{euros}", "5")}
              </p>
              {form.formState.errors.puntsPerEuro ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.puntsPerEuro.message}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <Label htmlFor="noCaduquen" className="cursor-pointer">
                {t("config.regles.noCaduquen")}
              </Label>
              <Switch
                id="noCaduquen"
                checked={noCaduquen}
                onCheckedChange={(v) => form.setValue("noCaduquen", v)}
              />
            </div>

            {!noCaduquen ? (
              <div className="space-y-2">
                <Label htmlFor="caducitatMesos">{t("config.regles.caducitat")}</Label>
                <Input
                  id="caducitatMesos"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  {...form.register("caducitatMesos")}
                />
                {form.formState.errors.caducitatMesos ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.caducitatMesos.message}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="puntsPerVisitaDefecte">
                {t("config.regles.puntsVisita")}
              </Label>
              <Input
                id="puntsPerVisitaDefecte"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                {...form.register("puntsPerVisitaDefecte")}
              />
              <p className="text-xs text-muted-foreground">
                {t("config.regles.puntsVisitaHint")}
              </p>
              {form.formState.errors.puntsPerVisitaDefecte ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.puntsPerVisitaDefecte.message}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Idioma */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{t("config.idioma.title")}</CardTitle>
            </div>
            <CardDescription>{t("config.idioma.hint")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={form.watch("idiomaDefecte")}
              onValueChange={(v) => form.setValue("idiomaDefecte", v as IdiomaDefecte)}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ca">{t("config.idioma.ca")}</SelectItem>
                <SelectItem value="es">{t("config.idioma.es")}</SelectItem>
                <SelectItem value="en">{t("config.idioma.en")}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={saveMut.isPending}>
          {saveMut.isPending ? t("config.saving") : t("config.save")}
        </Button>
      </div>

      {/* Zona de perill */}
      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base text-destructive">
              {t("config.perill.title")}
            </CardTitle>
          </div>
          <CardDescription>{t("config.perill.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DangerRow
            icon={<DownloadCloud className="h-4 w-4" />}
            title={t("config.perill.export.title")}
            desc={t("config.perill.export.desc")}
            cta={t("config.perill.export.cta")}
            confirmTitle={t("config.perill.export.confirmTitle")}
            confirmDesc={t("config.perill.export.confirmDesc")}
            confirmLabel={t("config.perill.confirmActionLabel")}
            cancelLabel={t("common.cancel")}
            onConfirm={() => exportMut.mutate()}
            pending={exportMut.isPending}
            variant="outline"
          />
          <DangerRow
            icon={<RefreshCcw className="h-4 w-4" />}
            title={t("config.perill.regen.title")}
            desc={t("config.perill.regen.desc")}
            cta={t("config.perill.regen.cta")}
            confirmTitle={t("config.perill.regen.confirmTitle")}
            confirmDesc={t("config.perill.regen.confirmDesc")}
            confirmLabel={t("config.perill.confirmActionLabel")}
            cancelLabel={t("common.cancel")}
            onConfirm={() => regenMut.mutate()}
            pending={regenMut.isPending}
            variant="outline"
          />
          <DangerRow
            icon={<PowerOff className="h-4 w-4" />}
            title={t("config.perill.deactivate.title")}
            desc={t("config.perill.deactivate.desc")}
            cta={t("config.perill.deactivate.cta")}
            confirmTitle={t("config.perill.deactivate.confirmTitle")}
            confirmDesc={t("config.perill.deactivate.confirmDesc")}
            confirmLabel={t("config.perill.deactivate.cta")}
            cancelLabel={t("common.cancel")}
            onConfirm={() => deactivateMut.mutate()}
            pending={deactivateMut.isPending}
            variant="destructive"
          />
        </CardContent>
      </Card>
    </form>
  );
}

type DangerRowProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  confirmTitle: string;
  confirmDesc: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  pending: boolean;
  variant: "outline" | "destructive";
};

function DangerRow({
  icon,
  title,
  desc,
  cta,
  confirmTitle,
  confirmDesc,
  confirmLabel,
  cancelLabel,
  onConfirm,
  pending,
  variant,
}: DangerRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-muted-foreground">{icon}</span>
        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={variant} disabled={pending} className="sm:self-center">
            {cta}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={
                variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
