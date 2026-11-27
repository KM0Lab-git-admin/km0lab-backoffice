import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { I18nField } from "@/components/backoffice/I18nField";
import { useLang } from "@/contexts/LangContext";
import { accioTipusList } from "@/services/accionsService";
import { tipusLabelKey } from "@/components/backoffice/AccioList";
import type { MessageKey } from "@/lib/i18n";
import type { AccioPunts, AccioPuntsInput, AccioPuntsTipus } from "@/types/backoffice";
import { normalizeLang, pickPlain, seedI18n, type Lang } from "@/types/i18n";

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
    tipus: z.enum([
      "registre",
      "primer_escaneig",
      "escaneig_qr",
      "aniversari",
      "visita_web",
      "registre_web",
      "esdeveniment",
      "personalitzada",
      "invitacio_persona",
      "invitacio_negoci",
    ]),

    punts: z.coerce.number().int().positive(),
    limitPerUsuari: z
      .union([z.coerce.number().int().positive(), z.literal("")])
      .optional(),
    limitTotal: z
      .union([z.coerce.number().int().positive(), z.literal("")])
      .optional(),
    vigenciaInici: z.string().optional().or(z.literal("")),
    vigenciaFi: z.string().optional().or(z.literal("")),
    condicions: z.string().optional().or(z.literal("")),
    activa: z.boolean(),
    visibleAHome: z.boolean(),
    url: z.string().optional().or(z.literal("")),
    esdevenimentId: z.string().optional().or(z.literal("")),
    comercId: z.string().optional().or(z.literal("")),
    cooldownValor: z
      .union([z.coerce.number().int().positive(), z.literal("")])
      .optional(),
    cooldownUnitat: z.enum(["dies", "setmanes", "mesos"]),
  })
  .refine(
    (v) =>
      !v.vigenciaInici ||
      !v.vigenciaFi ||
      new Date(v.vigenciaFi) >= new Date(v.vigenciaInici),
    { path: ["vigenciaFi"], message: "dateRange" },
  )
  .superRefine((v, ctx) => {
    if (
      (v.tipus === "visita_web" ||
        v.tipus === "registre_web" ||
        v.tipus === "esdeveniment") &&
      !v.url?.trim()
    ) {
      ctx.addIssue({ code: "custom", path: ["url"], message: "required" });
    }
    if (v.tipus === "personalitzada" && !v.condicions) {
      ctx.addIssue({ code: "custom", path: ["condicions"], message: "required" });
    }
    // Editable text types: require name + description in the source language.
    if (
      v.tipus === "personalitzada" ||
      v.tipus === "visita_web" ||
      v.tipus === "registre_web" ||
      v.tipus === "esdeveniment"
    ) {
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
    }
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: AccioPunts;
  onSubmit: (input: AccioPuntsInput) => Promise<unknown> | void;
  onCancel: () => void;
  submitting?: boolean;
};



export function AccioForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const { t } = useLang();



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
    defaultValues: {
      nom: initial?.nom ?? "",
      descripcio: initial?.descripcio ?? "",
      nomI18n: seedI18n(initial?.nom, normalizeLang(initial?.idiomaOrigen), initial?.nomI18n),
      descripcioI18n: seedI18n(
        initial?.descripcio,
        normalizeLang(initial?.idiomaOrigen),
        initial?.descripcioI18n,
      ),
      idiomaOrigen: normalizeLang(initial?.idiomaOrigen),
      tipus: initial?.tipus ?? "registre",
      punts: initial?.punts ?? 10,
      limitPerUsuari: initial?.limitPerUsuari ?? "",
      limitTotal: initial?.limitTotal ?? "",
      vigenciaInici: initial?.vigenciaInici ?? "",
      vigenciaFi: initial?.vigenciaFi ?? "",
      condicions: initial?.condicions ?? "",
      activa: initial?.activa ?? true,
      visibleAHome: initial?.visibleAHome ?? true,
      url: initial?.url ?? "",
      esdevenimentId: initial?.esdevenimentId ?? "",
      comercId: initial?.comercId ?? "",
      cooldownValor: initial?.cooldownValor ?? "",
      cooldownUnitat: initial?.cooldownUnitat ?? "mesos",
    },
  });

  useEffect(() => {
    if (initial) {
      const origen = normalizeLang(initial.idiomaOrigen);
      reset({
        nom: initial.nom,
        descripcio: initial.descripcio,
        nomI18n: seedI18n(initial.nom, origen, initial.nomI18n),
        descripcioI18n: seedI18n(initial.descripcio, origen, initial.descripcioI18n),
        idiomaOrigen: origen,
        tipus: initial.tipus,
        punts: initial.punts,
        limitPerUsuari: initial.limitPerUsuari ?? "",
        limitTotal: initial.limitTotal ?? "",
        vigenciaInici: initial.vigenciaInici ?? "",
        vigenciaFi: initial.vigenciaFi ?? "",
        condicions: initial.condicions ?? "",
        activa: initial.activa,
        visibleAHome: initial.visibleAHome ?? true,
        url: initial.url ?? "",
        esdevenimentId: initial.esdevenimentId ?? "",
        comercId: initial.comercId ?? "",
        cooldownValor: initial.cooldownValor ?? "",
        cooldownUnitat: initial.cooldownUnitat ?? "mesos",
      });
    }
  }, [initial, reset]);

  const tipus = watch("tipus");
  const activa = watch("activa");
  const visibleAHome = watch("visibleAHome");
  const cooldownUnitat = watch("cooldownUnitat");


  const registreNom = t("accions.registre.fixedNom");
  const registreDescripcio = t("accions.registre.fixedDescripcio");
  const primerEscaneigNom = t("accions.primerEscaneig.fixedNom");
  const primerEscaneigDescripcio = t("accions.primerEscaneig.fixedDescripcio");
  const escaneigQrNom = t("accions.escaneigQr.fixedNom");
  const escaneigQrDescripcio = t("accions.escaneigQr.fixedDescripcio");
  const aniversariNom = t("accions.aniversari.fixedNom");
  const aniversariDescripcio = t("accions.aniversari.fixedDescripcio");
  const invitacioPersonaNom = t("accions.invitacioPersona.fixedNom");
  const invitacioPersonaDescripcio = t("accions.invitacioPersona.fixedDescripcio");
  const invitacioNegociNom = t("accions.invitacioNegoci.fixedNom");
  const invitacioNegociDescripcio = t("accions.invitacioNegoci.fixedDescripcio");

  // Fixed catalog types: name/description are not editable (API serves by lang).
  const isFixedText = (tp: AccioPuntsTipus) =>
    tp === "registre" ||
    tp === "primer_escaneig" ||
    tp === "escaneig_qr" ||
    tp === "aniversari" ||
    tp === "invitacio_persona" ||
    tp === "invitacio_negoci";
  // Simple actions: hide limits/validity/conditions.
  const isSimpleAction = (tp: AccioPuntsTipus) =>
    tp === "registre" ||
    tp === "primer_escaneig" ||
    tp === "escaneig_qr" ||
    tp === "invitacio_persona" ||
    tp === "invitacio_negoci";
  const fixedCopy = (tp: AccioPuntsTipus) => {
    switch (tp) {
      case "primer_escaneig":
        return { nom: primerEscaneigNom, descripcio: primerEscaneigDescripcio };
      case "escaneig_qr":
        return { nom: escaneigQrNom, descripcio: escaneigQrDescripcio };
      case "aniversari":
        return { nom: aniversariNom, descripcio: aniversariDescripcio };
      case "invitacio_persona":
        return { nom: invitacioPersonaNom, descripcio: invitacioPersonaDescripcio };
      case "invitacio_negoci":
        return { nom: invitacioNegociNom, descripcio: invitacioNegociDescripcio };
      default:
        return { nom: registreNom, descripcio: registreDescripcio };
    }
  };
  const fixedInfoKey = (tp: AccioPuntsTipus): MessageKey => {
    switch (tp) {
      case "primer_escaneig":
        return "accions.primerEscaneig.info";
      case "escaneig_qr":
        return "accions.escaneigQr.info";
      case "aniversari":
        return "accions.aniversari.info";
      case "invitacio_persona":
        return "accions.invitacioPersona.info";
      case "invitacio_negoci":
        return "accions.invitacioNegoci.info";
      default:
        return "accions.registre.info";
    }
  };

  useEffect(() => {
    if (isFixedText(tipus)) {
      const { nom, descripcio } = fixedCopy(tipus);
      setValue("nom", nom, { shouldDirty: false });
      setValue("descripcio", descripcio, { shouldDirty: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tipus,
    registreNom,
    registreDescripcio,
    primerEscaneigNom,
    primerEscaneigDescripcio,
    escaneigQrNom,
    escaneigQrDescripcio,
    aniversariNom,
    aniversariDescripcio,
    invitacioPersonaNom,
    invitacioPersonaDescripcio,
    invitacioNegociNom,
    invitacioNegociDescripcio,
  ]);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const hasCooldown =
          values.tipus === "escaneig_qr" &&
          values.cooldownValor !== "" &&
          values.cooldownValor != null;
        const isFixed = isFixedText(values.tipus);
        const isSimple = isSimpleAction(values.tipus);
        const fixed = isFixed ? fixedCopy(values.tipus) : null;
        const origen = (values.idiomaOrigen ?? "ca") as Lang;
        const nomI18n = fixed
          ? seedI18n(fixed.nom, origen)
          : values.nomI18n;
        const descripcioI18n = fixed
          ? seedI18n(fixed.descripcio, origen)
          : values.descripcioI18n;
        const input: AccioPuntsInput = {
          nom: fixed ? fixed.nom : pickPlain(nomI18n, origen, values.nom),
          descripcio: fixed
            ? fixed.descripcio
            : pickPlain(descripcioI18n, origen, values.descripcio),
          nomI18n,
          descripcioI18n,
          idiomaOrigen: origen,
          tipus: values.tipus,
          punts: Number(values.punts),
          limitPerUsuari: isSimple
            ? values.tipus === "escaneig_qr"
              ? undefined
              : 1
            : values.limitPerUsuari === "" || values.limitPerUsuari == null
              ? undefined
              : Number(values.limitPerUsuari),
          limitTotal: isSimple
            ? undefined
            : values.limitTotal === "" || values.limitTotal == null
              ? undefined
              : Number(values.limitTotal),
          vigenciaInici: isSimple ? undefined : values.vigenciaInici || undefined,
          vigenciaFi: isSimple ? undefined : values.vigenciaFi || undefined,
          condicions: isSimple ? undefined : values.condicions || undefined,
          activa: values.activa,
          visibleAHome: values.visibleAHome,
          url:
            values.tipus === "visita_web" ||
            values.tipus === "registre_web" ||
            values.tipus === "esdeveniment"
              ? values.url || undefined
              : undefined,
          esdevenimentId: undefined,
          comercId: undefined,
          cooldownValor: hasCooldown ? Number(values.cooldownValor) : undefined,
          cooldownUnitat: hasCooldown ? values.cooldownUnitat : undefined,
        };
        return onSubmit(input);
      })}
      className="flex flex-col gap-5"
    >

      {/* Tipus */}
      <div className="flex flex-col gap-2">
        <Label>{t("accions.form.tipus.label")}</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {accioTipusList.map((tp) => {
            const selected = tipus === tp;
            return (
              <button
                key={tp}
                type="button"
                onClick={() => setValue("tipus", tp as AccioPuntsTipus, { shouldDirty: true })}
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

      {/* Camps específics per tipus */}
      {(tipus === "visita_web" ||
        tipus === "registre_web" ||
        tipus === "esdeveniment") && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="url">
            {tipus === "esdeveniment"
              ? t("accions.form.esdevenimentUrl.label")
              : t("accions.form.url.label")}
          </Label>
          <Input
            id="url"
            type="url"
            placeholder={
              tipus === "esdeveniment"
                ? t("accions.form.esdevenimentUrl.placeholder")
                : t("accions.form.url.placeholder")
            }
            aria-invalid={!!errors.url}
            {...register("url")}
          />
          {tipus === "esdeveniment" ? (
            <p className="text-xs text-muted-foreground">
              {t("accions.form.esdevenimentUrl.hint")}
            </p>
          ) : null}
          {errors.url ? (
            <p className="text-xs text-destructive">{t("form.error.required")}</p>
          ) : null}
        </div>
      )}

      {tipus === "escaneig_qr" && (
        <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-4">
          <div>
            <Label>{t("accions.form.cooldown.label")}</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("accions.form.cooldown.hint")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)]">
            <div className="flex flex-col gap-1">
              <Label htmlFor="cooldownValor" className="text-xs">
                {t("accions.form.cooldown.valor")}
              </Label>
              <Input
                id="cooldownValor"
                type="number"
                min={1}
                step={1}
                placeholder={t("accions.form.cooldown.none")}
                {...register("cooldownValor")}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">{t("accions.form.cooldown.unitat")}</Label>
              <Select
                value={cooldownUnitat}
                onValueChange={(v) =>
                  setValue("cooldownUnitat", v as "dies" | "setmanes" | "mesos", {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dies">{t("accions.form.cooldown.unit.dies")}</SelectItem>
                  <SelectItem value="setmanes">
                    {t("accions.form.cooldown.unit.setmanes")}
                  </SelectItem>
                  <SelectItem value="mesos">{t("accions.form.cooldown.unit.mesos")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}




      {/* Nom + Descripció: fixos per a tipus de catàleg; editables (i18n) per a web/event/custom */}
      {isFixedText(tipus) ? (
        <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">
              {t("accions.form.nom.label")}
            </Label>
            <p className="text-sm font-medium">{fixedCopy(tipus).nom}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">
              {t("accions.form.descripcio.label")}
            </Label>
            <p className="text-sm text-muted-foreground">{fixedCopy(tipus).descripcio}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {t(fixedInfoKey(tipus))}
          </p>
        </div>

      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {tipus === "visita_web" ||
            tipus === "registre_web" ||
            tipus === "esdeveniment"
              ? t("accions.form.i18nHintWeb")
              : t("accions.form.i18nHint")}
          </p>
          <Controller
            control={control}
            name="nomI18n"
            render={({ field }) => (
              <I18nField
                id="nom"
                label={t("accions.form.nom.label")}
                value={field.value}
                sourceLang={watch("idiomaOrigen")}
                onChange={field.onChange}
                onSourceLangChange={(lang) => setValue("idiomaOrigen", lang)}
                placeholder={t("accions.form.nom.placeholder")}
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
                id="descripcio"
                label={t("accions.form.descripcio.label")}
                value={field.value}
                sourceLang={watch("idiomaOrigen")}
                onChange={field.onChange}
                onSourceLangChange={(lang) => setValue("idiomaOrigen", lang)}
                multiline
                rows={3}
                placeholder={t("accions.form.descripcio.placeholder")}
              />
            )}
          />
          {errors.descripcioI18n ? (
            <p className="text-xs text-destructive">{t("form.error.required")}</p>
          ) : null}
        </>
      )}

      {/* Punts */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="punts">{t("accions.form.punts.label")}</Label>
        <Input
          id="punts"
          type="number"
          min={1}
          step={1}
          aria-invalid={!!errors.punts}
          {...register("punts")}
        />
        {errors.punts ? (
          <p className="text-xs text-destructive">{t("accions.form.punts.error")}</p>
        ) : null}
      </div>

      {!isSimpleAction(tipus) && (
        <>
          {/* Límits */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="limitPerUsuari">
                {t("accions.form.limitPerUsuari.label")}{" "}
                <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
              </Label>
              <Input
                id="limitPerUsuari"
                type="number"
                min={1}
                step={1}
                placeholder="1"
                {...register("limitPerUsuari")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="limitTotal">
                {t("accions.form.limitTotal.label")}{" "}
                <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
              </Label>
              <Input
                id="limitTotal"
                type="number"
                min={1}
                step={1}
                {...register("limitTotal")}
              />
            </div>
          </div>

          {/* Vigència */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="vigenciaInici">
                {t("accions.form.vigencia.from")}{" "}
                <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
              </Label>
              <Input id="vigenciaInici" type="date" {...register("vigenciaInici")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vigenciaFi">
                {t("accions.form.vigencia.to")}{" "}
                <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
              </Label>
              <Input
                id="vigenciaFi"
                type="date"
                aria-invalid={!!errors.vigenciaFi}
                {...register("vigenciaFi")}
              />
              {errors.vigenciaFi ? (
                <p className="text-xs text-destructive">{t("form.error.dateRange")}</p>
              ) : null}
            </div>
          </div>

          {/* Condicions */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="condicions">{t("accions.form.condicions.label")}</Label>
            <Textarea
              id="condicions"
              rows={2}
              placeholder={t("accions.form.condicions.placeholder")}
              aria-invalid={!!errors.condicions}
              {...register("condicions")}
            />
            {errors.condicions ? (
              <p className="text-xs text-destructive">{t("form.error.required")}</p>
            ) : null}
          </div>
        </>
      )}

      {/* Activa */}
      <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{t("accions.form.active.label")}</p>
          <p className="text-xs text-muted-foreground">
            {t("accions.form.active.hint")}
          </p>
        </div>
        <Switch
          checked={activa}
          onCheckedChange={(v) => setValue("activa", v, { shouldDirty: true })}
          aria-label={t("accions.form.active.label")}
        />
      </div>

      {/* Visible a la home dels veïns */}
      <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{t("accions.form.visibleHome.label")}</p>
          <p className="text-xs text-muted-foreground">
            {t("accions.form.visibleHome.hint")}
          </p>
        </div>
        <Switch
          checked={visibleAHome}
          onCheckedChange={(v) => setValue("visibleAHome", v, { shouldDirty: true })}
          aria-label={t("accions.form.visibleHome.label")}
        />
      </div>


      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t("form.submitting") : t("accions.form.submit")}
        </Button>
      </div>
    </form>
  );
}
