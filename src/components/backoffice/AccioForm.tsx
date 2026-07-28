import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
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
import { useLang } from "@/contexts/LangContext";
import { accionsService, accioTipusList } from "@/services/accionsService";
import { tipusLabelKey } from "@/components/backoffice/AccioList";
import type { AccioPunts, AccioPuntsInput, AccioPuntsTipus } from "@/types/backoffice";

const schema = z
  .object({
    nom: z.string().min(1),
    descripcio: z.string().min(1),
    tipus: z.enum([
      "registre",
      "escaneig_qr",
      "visita_web",
      "registre_web",
      "esdeveniment",
      "personalitzada",
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
    url: z.string().optional().or(z.literal("")),
    esdevenimentId: z.string().optional().or(z.literal("")),
    comercId: z.string().optional().or(z.literal("")),
  })
  .refine(
    (v) =>
      !v.vigenciaInici ||
      !v.vigenciaFi ||
      new Date(v.vigenciaFi) >= new Date(v.vigenciaInici),
    { path: ["vigenciaFi"], message: "dateRange" },
  )
  .superRefine((v, ctx) => {
    if ((v.tipus === "visita_web" || v.tipus === "registre_web") && !v.url) {
      ctx.addIssue({ code: "custom", path: ["url"], message: "required" });
    }
    if (v.tipus === "esdeveniment" && !v.esdevenimentId) {
      ctx.addIssue({ code: "custom", path: ["esdevenimentId"], message: "required" });
    }
    if (v.tipus === "personalitzada" && !v.condicions) {
      ctx.addIssue({ code: "custom", path: ["condicions"], message: "required" });
    }
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: AccioPunts;
  onSubmit: (input: AccioPuntsInput) => Promise<unknown> | void;
  onCancel: () => void;
  submitting?: boolean;
};

const COMERC_ANY = "__any__";

export function AccioForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const { t } = useLang();

  const comercosQ = useQuery({
    queryKey: ["accions", "comercos-options"],
    queryFn: () => accionsService.getComercosOptions(),
  });
  const esdevenimentsQ = useQuery({
    queryKey: ["accions", "esdeveniments-options"],
    queryFn: () => accionsService.getEsdevenimentsOptions(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: initial?.nom ?? "",
      descripcio: initial?.descripcio ?? "",
      tipus: initial?.tipus ?? "registre",
      punts: initial?.punts ?? 10,
      limitPerUsuari: initial?.limitPerUsuari ?? "",
      limitTotal: initial?.limitTotal ?? "",
      vigenciaInici: initial?.vigenciaInici ?? "",
      vigenciaFi: initial?.vigenciaFi ?? "",
      condicions: initial?.condicions ?? "",
      activa: initial?.activa ?? true,
      url: initial?.url ?? "",
      esdevenimentId: initial?.esdevenimentId ?? "",
      comercId: initial?.comercId ?? "",
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        nom: initial.nom,
        descripcio: initial.descripcio,
        tipus: initial.tipus,
        punts: initial.punts,
        limitPerUsuari: initial.limitPerUsuari ?? "",
        limitTotal: initial.limitTotal ?? "",
        vigenciaInici: initial.vigenciaInici ?? "",
        vigenciaFi: initial.vigenciaFi ?? "",
        condicions: initial.condicions ?? "",
        activa: initial.activa,
        url: initial.url ?? "",
        esdevenimentId: initial.esdevenimentId ?? "",
        comercId: initial.comercId ?? "",
      });
    }
  }, [initial, reset]);

  const tipus = watch("tipus");
  const activa = watch("activa");
  const comercId = watch("comercId");
  const esdevenimentId = watch("esdevenimentId");

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const input: AccioPuntsInput = {
          nom: values.nom,
          descripcio: values.descripcio,
          tipus: values.tipus,
          punts: Number(values.punts),
          limitPerUsuari:
            values.limitPerUsuari === "" || values.limitPerUsuari == null
              ? undefined
              : Number(values.limitPerUsuari),
          limitTotal:
            values.limitTotal === "" || values.limitTotal == null
              ? undefined
              : Number(values.limitTotal),
          vigenciaInici: values.vigenciaInici || undefined,
          vigenciaFi: values.vigenciaFi || undefined,
          condicions: values.condicions || undefined,
          activa: values.activa,
          url:
            values.tipus === "visita_web" || values.tipus === "registre_web"
              ? values.url || undefined
              : undefined,
          esdevenimentId:
            values.tipus === "esdeveniment" ? values.esdevenimentId || undefined : undefined,
          comercId:
            values.tipus === "escaneig_qr"
              ? values.comercId && values.comercId !== COMERC_ANY
                ? values.comercId
                : undefined
              : undefined,
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
      {(tipus === "visita_web" || tipus === "registre_web") && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="url">{t("accions.form.url.label")}</Label>
          <Input
            id="url"
            placeholder={t("accions.form.url.placeholder")}
            aria-invalid={!!errors.url}
            {...register("url")}
          />
          {errors.url ? (
            <p className="text-xs text-destructive">{t("form.error.required")}</p>
          ) : null}
        </div>
      )}

      {tipus === "esdeveniment" && (
        <div className="flex flex-col gap-2">
          <Label>{t("accions.form.esdeveniment.label")}</Label>
          <Select
            value={esdevenimentId || undefined}
            onValueChange={(v) => setValue("esdevenimentId", v, { shouldDirty: true })}
          >
            <SelectTrigger aria-invalid={!!errors.esdevenimentId}>
              <SelectValue placeholder={t("accions.form.esdeveniment.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {esdevenimentsQ.data?.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.esdevenimentId ? (
            <p className="text-xs text-destructive">{t("form.error.required")}</p>
          ) : null}
        </div>
      )}

      {tipus === "escaneig_qr" && (
        <div className="flex flex-col gap-2">
          <Label>{t("accions.form.comerc.label")}</Label>
          <Select
            value={comercId || COMERC_ANY}
            onValueChange={(v) => setValue("comercId", v, { shouldDirty: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={COMERC_ANY}>{t("accions.form.comerc.any")}</SelectItem>
              {comercosQ.data?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Nom */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="nom">{t("accions.form.nom.label")}</Label>
        <Input
          id="nom"
          placeholder={t("accions.form.nom.placeholder")}
          aria-invalid={!!errors.nom}
          {...register("nom")}
        />
        {errors.nom ? (
          <p className="text-xs text-destructive">{t("form.error.required")}</p>
        ) : null}
      </div>

      {/* Descripció */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="descripcio">{t("accions.form.descripcio.label")}</Label>
        <Textarea
          id="descripcio"
          rows={3}
          placeholder={t("accions.form.descripcio.placeholder")}
          aria-invalid={!!errors.descripcio}
          {...register("descripcio")}
        />
        {errors.descripcio ? (
          <p className="text-xs text-destructive">{t("form.error.required")}</p>
        ) : null}
      </div>

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
