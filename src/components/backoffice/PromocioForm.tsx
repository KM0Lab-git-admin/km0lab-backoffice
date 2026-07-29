import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLang } from "@/contexts/LangContext";
import type { MessageKey } from "@/lib/i18n";
import type { Promocio, PromocioInput, PromoTipus } from "@/types/merchant";
import { promoTipusList } from "@/services/promocionsService";

const promoSchema = z
  .object({
    titol: z.string().min(1),
    tipus: z.enum(["descompte", "dos_x_un", "regal", "preu_especial"]),
    valor: z.string().optional().or(z.literal("")),
    compraMinima: z.string().optional().or(z.literal("")),
    detall: z.string().min(1),
    vigenciaInici: z.string().optional().or(z.literal("")),
    vigenciaFi: z.string().optional().or(z.literal("")),
    condicio: z.string().optional().or(z.literal("")),
    activa: z.boolean(),
  })
  .refine(
    (v) =>
      !v.vigenciaInici ||
      !v.vigenciaFi ||
      new Date(v.vigenciaFi) >= new Date(v.vigenciaInici),
    { path: ["vigenciaFi"], message: "dateRange" },
  );

type FormValues = z.infer<typeof promoSchema>;

type Props = {
  initial?: Promocio;
  onSubmit: (input: PromocioInput) => Promise<unknown> | void;
  onCancel: () => void;
  submitting?: boolean;
};

export function PromocioForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const { t } = useLang();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      titol: initial?.titol ?? "",
      tipus: initial?.tipus ?? "descompte",
      valor: initial?.valor ?? "",
      compraMinima: initial?.compraMinima ?? "",
      detall: initial?.detall ?? "",
      vigenciaInici: initial?.vigenciaInici ?? "",
      vigenciaFi: initial?.vigenciaFi ?? "",
      condicio: initial?.condicio ?? "",
      activa: initial?.activa ?? true,
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        titol: initial.titol,
        tipus: initial.tipus,
        valor: initial.valor ?? "",
        compraMinima: initial.compraMinima ?? "",
        detall: initial.detall,
        vigenciaInici: initial.vigenciaInici ?? "",
        vigenciaFi: initial.vigenciaFi ?? "",
        condicio: initial.condicio ?? "",
        activa: initial.activa,
      });
    }
  }, [initial, reset]);

  const tipus = watch("tipus");
  const activa = watch("activa");

  const showValueField = tipus === "descompte" || tipus === "preu_especial";

  const typeLabelKey = (tp: PromoTipus): MessageKey =>
    tp === "descompte"
      ? "form.type.descompte"
      : tp === "dos_x_un"
        ? "form.type.dos_x_un"
        : tp === "regal"
          ? "form.type.regal"
          : "form.type.preu_especial";

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const input: PromocioInput = {
          titol: values.titol,
          tipus: values.tipus,
          valor: values.valor || undefined,
          compraMinima: values.compraMinima || undefined,
          detall: values.detall,
          vigenciaInici: values.vigenciaInici || undefined,
          vigenciaFi: values.vigenciaFi || undefined,
          condicio: values.condicio || undefined,
          activa: values.activa,
        };
        return onSubmit(input);
      })}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="titol">{t("form.name.label")}</Label>
        <Input
          id="titol"
          placeholder={t("form.name.placeholder")}
          aria-invalid={!!errors.titol}
          {...register("titol")}
        />
        {errors.titol ? (
          <p className="text-xs text-destructive">{t("form.error.required")}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("form.type.label")}</Label>
        <Tabs
          value={tipus}
          onValueChange={(v) => setValue("tipus", v as PromoTipus, { shouldDirty: true })}
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            {promoTipusList.map((tp) => (
              <TabsTrigger key={tp} value={tp}>
                {t(typeLabelKey(tp))}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {showValueField ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="valor">{t("form.value.label")}</Label>
            <Input
              id="valor"
              placeholder={t("form.value.placeholder")}
              {...register("valor")}
            />
          </div>
        ) : (
          <div className="hidden md:block" />
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="compraMinima">
            {t("form.minPurchase.label")}{" "}
            <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
          </Label>
          <Input
            id="compraMinima"
            placeholder={t("form.minPurchase.placeholder")}
            {...register("compraMinima")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="detall">{t("form.detail.label")}</Label>
        <Input
          id="detall"
          placeholder={t("form.detail.placeholder")}
          aria-invalid={!!errors.detall}
          {...register("detall")}
        />
        {errors.detall ? (
          <p className="text-xs text-destructive">{t("form.error.required")}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("form.validity.label")}</Label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{t("form.validity.from")}</span>
            <Input type="date" {...register("vigenciaInici")} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{t("form.validity.to")}</span>
            <Input
              type="date"
              aria-invalid={!!errors.vigenciaFi}
              {...register("vigenciaFi")}
            />
            {errors.vigenciaFi?.message === "dateRange" ? (
              <p className="text-xs text-destructive">{t("form.error.dateRange")}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="condicio">{t("form.condition.label")}</Label>
        <Textarea
          id="condicio"
          rows={2}
          placeholder={t("form.condition.placeholder")}
          {...register("condicio")}
        />
      </div>

      <div className="flex items-center justify-between rounded-md border bg-muted/40 p-3">
        <Label htmlFor="activa" className="cursor-pointer">
          {t("form.active.label")}
        </Label>
        <Switch
          id="activa"
          checked={activa}
          onCheckedChange={(v) => setValue("activa", v, { shouldDirty: true })}
        />
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t("form.submitting") : t("form.submit")}
        </Button>
      </div>
    </form>
  );
}
