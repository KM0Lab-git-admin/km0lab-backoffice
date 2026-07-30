import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { I18nField } from "@/components/backoffice/I18nField";
import { useLang } from "@/contexts/LangContext";
import { recompensesService } from "@/services/recompensesService";
import { ImageUploader } from "@/components/backoffice/ImageUploader";
import { RecompensaTipusIcon } from "@/components/backoffice/recompensaTipusIcon";
import {
  estatLabelKey,
  tipusLabelKey,
} from "@/components/backoffice/RecompensaList";
import type {
  Recompensa,
  RecompensaEstat,
  RecompensaInput,
  RecompensaTipus,
} from "@/types/backoffice";
import { normalizeLang, pickPlain, seedI18n, type Lang } from "@/types/i18n";

const TIPUS_LIST: RecompensaTipus[] = [
  "descompte",
  "saldo",
  "producte",
  "servei",
  "marxandatge",
  "experiencia",
];

const ESTAT_LIST: RecompensaEstat[] = ["activa", "inactiva", "esgotada"];

const i18nMapSchema = z.object({
  ca: z.string().optional(),
  es: z.string().optional(),
  en: z.string().optional(),
});

const schema = z
  .object({
    nom: z.string().optional().or(z.literal("")),
    descripcio: z.string().optional().or(z.literal("")),
    nomI18n: i18nMapSchema,
    descripcioI18n: i18nMapSchema,
    idiomaOrigen: z.enum(["ca", "es", "en"]),
    imatgeUrl: z.string().optional(),
    tipus: z.enum([
      "descompte",
      "saldo",
      "producte",
      "servei",
      "marxandatge",
      "experiencia",
    ]),
    puntsNecessaris: z.coerce.number().int().positive(),
    valor: z.string().optional().or(z.literal("")),
    comercosTots: z.boolean(),
    comercosIds: z.array(z.string()),
    estocIllimitat: z.boolean(),
    estoc: z
      .union([z.coerce.number().int().nonnegative(), z.literal("")])
      .optional(),
    dataInici: z.string().optional().or(z.literal("")),
    dataFi: z.string().optional().or(z.literal("")),
    condicions: z.string().optional().or(z.literal("")),
    estat: z.enum(["activa", "inactiva", "esgotada"]),
  })
  .refine(
    (v) => v.comercosTots || v.comercosIds.length > 0,
    { path: ["comercosIds"], message: "required" },
  )
  .refine(
    (v) => !v.dataInici || !v.dataFi || new Date(v.dataFi) >= new Date(v.dataInici),
    { path: ["dataFi"], message: "dateRange" },
  )
  .superRefine((v, ctx) => {
    const src = v.idiomaOrigen;
    if (!(v.nomI18n[src] || "").trim()) {
      ctx.addIssue({ code: "custom", path: ["nomI18n"], message: "required" });
    }
    if (!(v.descripcioI18n[src] || "").trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["descripcioI18n"],
        message: "required",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: Recompensa;
  onSubmit: (input: RecompensaInput) => Promise<unknown> | void;
  onCancel: () => void;
  submitting?: boolean;
};

function toDefaults(initial?: Recompensa): FormValues {
  const comercosTots = !initial || initial.comercos === "tots";
  const origen = normalizeLang(initial?.idiomaOrigen);
  return {
    nom: initial?.nom ?? "",
    descripcio: initial?.descripcio ?? "",
    nomI18n: seedI18n(initial?.nom, origen, initial?.nomI18n),
    descripcioI18n: seedI18n(initial?.descripcio, origen, initial?.descripcioI18n),
    idiomaOrigen: origen,
    imatgeUrl: initial?.imatgeUrl,
    tipus: initial?.tipus ?? "saldo",
    puntsNecessaris: initial?.puntsNecessaris ?? 500,
    valor: initial?.valor ?? "",
    comercosTots,
    comercosIds: initial && initial.comercos !== "tots" ? initial.comercos : [],
    estocIllimitat: initial ? typeof initial.estoc !== "number" : true,
    estoc: initial && typeof initial.estoc === "number" ? initial.estoc : "",
    dataInici: initial?.dataInici ?? "",
    dataFi: initial?.dataFi ?? "",
    condicions: initial?.condicions ?? "",
    estat: initial?.estat ?? "activa",
  };
}

export function RecompensaForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const { t } = useLang();

  const comercosQ = useQuery({
    queryKey: ["recompenses", "comercos-options"],
    queryFn: () => recompensesService.getComercosOptions(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(initial),
  });

  useEffect(() => {
    if (initial) reset(toDefaults(initial));
  }, [initial, reset]);

  const tipus = watch("tipus");
  const estat = watch("estat");
  const comercosTots = watch("comercosTots");
  const comercosIds = watch("comercosIds");
  const estocIllimitat = watch("estocIllimitat");
  const estocValue = watch("estoc");
  const imatgeUrl = watch("imatgeUrl");
  const idiomaOrigen = watch("idiomaOrigen");

  const shouldForceEsgotada =
    !estocIllimitat && typeof estocValue === "number" && estocValue === 0;

  useEffect(() => {
    if (shouldForceEsgotada && estat !== "esgotada") {
      setValue("estat", "esgotada", { shouldDirty: true });
    }
  }, [shouldForceEsgotada, estat, setValue]);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const origen = values.idiomaOrigen as Lang;
        const nomI18n = values.nomI18n;
        const descripcioI18n = values.descripcioI18n;
        const input: RecompensaInput = {
          nom: pickPlain(nomI18n, origen, values.nom),
          descripcio: pickPlain(descripcioI18n, origen, values.descripcio),
          nomI18n,
          descripcioI18n,
          idiomaOrigen: origen,
          imatgeUrl: values.imatgeUrl || undefined,
          tipus: values.tipus,
          puntsNecessaris: Number(values.puntsNecessaris),
          valor: values.valor ? values.valor.trim() : undefined,
          // Comerços selector temporarily disabled in UI — always all merchants.
          comercos: "tots",
          estoc: values.estocIllimitat
            ? undefined
            : typeof values.estoc === "number"
              ? values.estoc
              : values.estoc === ""
                ? 0
                : Number(values.estoc),
          dataInici: values.dataInici || undefined,
          dataFi: values.dataFi || undefined,
          condicions: values.condicions ? values.condicions.trim() : undefined,
          estat: values.estat,
        };
        return onSubmit(input);
      })}
      className="flex flex-col gap-5"
    >
      {/* Imatge */}
      <ImageUploader
        value={imatgeUrl}
        onChange={(v) => setValue("imatgeUrl", v, { shouldDirty: true })}
        aspect="hero"
        label={t("recompenses.form.imatge.label")}
        hint={t("recompenses.form.imatge.hint")}
        recommendation={t("recompenses.form.imatge.recommendation")}
        placeholderLabel={t("recompenses.form.imatge.placeholder")}
        placeholderNode={
          <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-km0-yellow-300/40 to-km0-yellow-400/50 px-6 py-8 text-km0-blue-800">
            <RecompensaTipusIcon tipus={tipus} className="h-14 w-14" />
            <span className="text-xs font-medium">{t(tipusLabelKey(tipus))}</span>
          </div>
        }
      />

      <Controller
        control={control}
        name="nomI18n"
        render={({ field }) => (
          <I18nField
            id="rec-nom"
            label={t("recompenses.form.nom.label")}
            value={field.value}
            sourceLang={idiomaOrigen}
            onChange={field.onChange}
            onSourceLangChange={(lang) => setValue("idiomaOrigen", lang)}
            placeholder={t("recompenses.form.nom.placeholder")}
          />
        )}
      />
      {errors.nomI18n ? (
        <p className="text-xs text-destructive">{t("form.error.required")}</p>
      ) : null}

      <Controller
        control={control}
        name="descripcioI18n"
        render={({ field }) => (
          <I18nField
            id="rec-descripcio"
            label={t("recompenses.form.descripcio.label")}
            value={field.value}
            sourceLang={idiomaOrigen}
            onChange={field.onChange}
            onSourceLangChange={(lang) => setValue("idiomaOrigen", lang)}
            multiline
            rows={3}
            placeholder={t("recompenses.form.descripcio.placeholder")}
          />
        )}
      />
      {errors.descripcioI18n ? (
        <p className="text-xs text-destructive">{t("form.error.required")}</p>
      ) : null}

      {/* Tipus */}
      <div className="flex flex-col gap-2">
        <Label>{t("recompenses.form.tipus.label")}</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TIPUS_LIST.map((tp) => {
            const selected = tipus === tp;
            return (
              <button
                key={tp}
                type="button"
                onClick={() => setValue("tipus", tp, { shouldDirty: true })}
                className={
                  selected
                    ? "rounded-md border-2 border-primary bg-primary/10 px-3 py-2 text-left text-sm font-medium"
                    : "rounded-md border bg-background px-3 py-2 text-left text-sm hover:bg-muted"
                }
              >
                {t(tipusLabelKey(tp))}
              </button>
            );
          })}
        </div>
      </div>

      {/* Punts + valor */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="rec-punts">{t("recompenses.form.punts.label")}</Label>
          <Input
            id="rec-punts"
            type="number"
            min={1}
            step={1}
            aria-invalid={!!errors.puntsNecessaris}
            {...register("puntsNecessaris")}
          />
          {errors.puntsNecessaris ? (
            <p className="text-xs text-destructive">{t("recompenses.form.punts.error")}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rec-valor">
            {t("recompenses.form.valor.label")}{" "}
            <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
          </Label>
          <Input
            id="rec-valor"
            placeholder={t("recompenses.form.valor.placeholder")}
            {...register("valor")}
          />
        </div>
      </div>

      {/* Comerços — visible but disabled until multi-merchant selection is ready */}
      <div
        className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3 opacity-60"
        aria-disabled="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">{t("recompenses.form.comercos.label")}</p>
            <p className="text-xs text-muted-foreground">
              {t("recompenses.form.comercos.hint")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("recompenses.form.comercos.disabled")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {t("recompenses.form.comercos.tots")}
            </span>
            <Switch
              checked={true}
              disabled
              aria-label={t("recompenses.form.comercos.tots")}
            />
          </div>
        </div>
        {!comercosTots ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {comercosQ.data?.map((c) => {
              const checked = comercosIds.includes(c.id);
              return (
                <label
                  key={c.id}
                  className="flex cursor-not-allowed items-center gap-2 rounded-md border bg-background p-2 text-sm"
                >
                  <Checkbox
                    checked={checked}
                    disabled
                    aria-label={c.nom}
                  />
                  <span className="truncate">{c.nom}</span>
                </label>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Estoc */}
      <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="rec-estoc" className="m-0">
            {t("recompenses.form.estoc.label")}
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {t("recompenses.form.estoc.unlimited")}
            </span>
            <Switch
              checked={estocIllimitat}
              onCheckedChange={(v) => setValue("estocIllimitat", v, { shouldDirty: true })}
              aria-label={t("recompenses.form.estoc.unlimited")}
            />
          </div>
        </div>
        {!estocIllimitat ? (
          <Input
            id="rec-estoc"
            type="number"
            min={0}
            step={1}
            {...register("estoc")}
          />
        ) : null}
      </div>

      {/* Vigència */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="rec-inici">
            {t("recompenses.form.dates.from")}{" "}
            <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
          </Label>
          <Input id="rec-inici" type="date" {...register("dataInici")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rec-fi">
            {t("recompenses.form.dates.to")}{" "}
            <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
          </Label>
          <Input
            id="rec-fi"
            type="date"
            aria-invalid={!!errors.dataFi}
            {...register("dataFi")}
          />
          {errors.dataFi ? (
            <p className="text-xs text-destructive">{t("form.error.dateRange")}</p>
          ) : null}
        </div>
      </div>

      {/* Condicions */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="rec-condicions">{t("recompenses.form.condicions.label")}</Label>
        <Textarea
          id="rec-condicions"
          rows={2}
          placeholder={t("recompenses.form.condicions.placeholder")}
          {...register("condicions")}
        />
      </div>

      {/* Estat */}
      <div className="flex flex-col gap-2">
        <Label>{t("recompenses.form.estat.label")}</Label>
        <div className="grid grid-cols-3 gap-2">
          {ESTAT_LIST.map((e) => {
            const selected = estat === e;
            return (
              <button
                key={e}
                type="button"
                onClick={() => setValue("estat", e, { shouldDirty: true })}
                className={
                  selected
                    ? "rounded-md border-2 border-primary bg-primary/10 px-3 py-2 text-sm font-medium"
                    : "rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
                }
              >
                {t(estatLabelKey(e))}
              </button>
            );
          })}
        </div>
        {shouldForceEsgotada ? (
          <p className="text-xs text-muted-foreground">
            {t("recompenses.form.estat.hintEsgotada")}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t("form.submitting") : t("recompenses.form.submit")}
        </Button>
      </div>
    </form>
  );
}
