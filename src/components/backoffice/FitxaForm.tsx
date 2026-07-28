import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/backoffice/ImageUploader";
import { useLang } from "@/contexts/LangContext";
import type { MessageKey } from "@/lib/i18n";
import type {
  ComercFitxa,
  ComercFitxaInput,
  DiaSetmana,
  HorariDia,
} from "@/types/comerc";

const dayOrder: DiaSetmana[] = [
  "dilluns",
  "dimarts",
  "dimecres",
  "dijous",
  "divendres",
  "dissabte",
  "diumenge",
];

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const horariDiaSchema: z.ZodType<HorariDia> = z.object({
  tancat: z.boolean(),
  obertura: z.string().regex(timePattern),
  tancament: z.string().regex(timePattern),
});

const schema = z.object({
  nom: z.string().trim().min(1).max(80),
  categoriesText: z.string().trim().min(1).max(120),
  descripcio: z.string().trim().max(400),
  logoUrl: z.string().optional(),
  heroUrl: z.string().optional(),
  adreca: z.string().trim().min(1).max(120),
  codiPostal: z.string().trim().min(1).max(10),
  poblacio: z.string().trim().min(1).max(60),
  telefon: z.string().trim().max(30),
  web: z.string().trim().max(120),
  horari: z.object({
    dilluns: horariDiaSchema,
    dimarts: horariDiaSchema,
    dimecres: horariDiaSchema,
    dijous: horariDiaSchema,
    divendres: horariDiaSchema,
    dissabte: horariDiaSchema,
    diumenge: horariDiaSchema,
  }),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial: ComercFitxa;
  onValuesChange: (values: ComercFitxaInput) => void;
  onSubmit: (values: ComercFitxaInput) => Promise<unknown> | void;
  submitting?: boolean;
};

function toFormValues(f: ComercFitxa): FormValues {
  return {
    nom: f.nom,
    categoriesText: f.categories.join(", "),
    descripcio: f.descripcio,
    logoUrl: f.logoUrl,
    heroUrl: f.heroUrl,
    adreca: f.adreca,
    codiPostal: f.codiPostal,
    poblacio: f.poblacio,
    telefon: f.telefon,
    web: f.web,
    horari: f.horari,
  };
}

function toInput(v: FormValues): ComercFitxaInput {
  return {
    nom: v.nom,
    categories: v.categoriesText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    descripcio: v.descripcio,
    logoUrl: v.logoUrl,
    heroUrl: v.heroUrl,
    adreca: v.adreca,
    codiPostal: v.codiPostal,
    poblacio: v.poblacio,
    telefon: v.telefon,
    web: v.web,
    horari: v.horari,
  };
}

export function FitxaForm({
  initial,
  onValuesChange,
  onSubmit,
  submitting,
}: Props) {
  const { t } = useLang();
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(initial),
  });

  useEffect(() => {
    reset(toFormValues(initial));
  }, [initial, reset]);

  // Live preview sync
  useEffect(() => {
    const sub = watch((value) => {
      onValuesChange(toInput(value as FormValues));
    });
    return () => sub.unsubscribe();
  }, [watch, onValuesChange]);

  return (
    <form
      onSubmit={handleSubmit((v) => onSubmit(toInput(v)))}
      className="flex flex-col gap-8"
    >
      {/* Brand */}
      <section className="flex flex-col gap-5">
        <header>
          <h2 className="text-base font-bold">{t("fitxa.section.brand")}</h2>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            name="logoUrl"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                aspect="square"
                label={t("fitxa.logo.label")}
                hint={t("fitxa.logo.hint")}
                recommendation={t("fitxa.logo.recommendation")}
                placeholderLabel={t("fitxa.preview.logoPlaceholder")}
              />
            )}
          />
          <Controller
            name="heroUrl"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                aspect="hero"
                label={t("fitxa.hero.label")}
                hint={t("fitxa.hero.hint")}
                recommendation={t("fitxa.hero.recommendation")}
                placeholderLabel={t("fitxa.preview.heroPlaceholder")}
              />
            )}
          />

        </div>
      </section>

      <Separator />

      {/* Info */}
      <section className="flex flex-col gap-4">
        <header>
          <h2 className="text-base font-bold">{t("fitxa.section.info")}</h2>
        </header>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nom">{t("fitxa.nom.label")}</Label>
          <Input id="nom" aria-invalid={!!errors.nom} {...register("nom")} />
          {errors.nom ? (
            <p className="text-xs text-destructive">{t("form.error.required")}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="categoriesText">{t("fitxa.categories.label")}</Label>
          <Input
            id="categoriesText"
            aria-invalid={!!errors.categoriesText}
            {...register("categoriesText")}
          />
          <p className="text-xs text-muted-foreground">
            {t("fitxa.categories.hint")}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="descripcio">{t("fitxa.descripcio.label")}</Label>
          <Textarea id="descripcio" rows={3} {...register("descripcio")} />
          <p className="text-xs text-muted-foreground">
            {t("fitxa.descripcio.hint")}
          </p>
        </div>
      </section>

      <Separator />

      {/* Contact */}
      <section className="flex flex-col gap-4">
        <header>
          <h2 className="text-base font-bold">{t("fitxa.section.contact")}</h2>
        </header>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="adreca">{t("fitxa.adreca.label")}</Label>
            <Input
              id="adreca"
              aria-invalid={!!errors.adreca}
              {...register("adreca")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="codiPostal">{t("fitxa.codiPostal.label")}</Label>
            <Input id="codiPostal" {...register("codiPostal")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="poblacio">{t("fitxa.poblacio.label")}</Label>
            <Input id="poblacio" {...register("poblacio")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="telefon">{t("fitxa.telefon.label")}</Label>
            <Input id="telefon" inputMode="tel" {...register("telefon")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="web">{t("fitxa.web.label")}</Label>
            <Input id="web" {...register("web")} />
          </div>
        </div>
      </section>

      <Separator />

      {/* Hours */}
      <section className="flex flex-col gap-3">
        <header>
          <h2 className="text-base font-bold">{t("fitxa.section.horari")}</h2>
        </header>
        <ul className="flex flex-col gap-2">
          {dayOrder.map((day) => {
            const key = `fitxa.day.${day}` as MessageKey;
            const tancat = watch(`horari.${day}.tancat`);
            return (
              <li
                key={day}
                className="flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium">{t(key)}</span>
                  <Controller
                    name={`horari.${day}.tancat`}
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Switch
                          checked={!field.value}
                          onCheckedChange={(v) => field.onChange(!v)}
                        />
                        {field.value
                          ? t("fitxa.horari.tancat")
                          : t("fitxa.horari.obertAra")}
                      </label>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    aria-label={t("fitxa.horari.obertura")}
                    disabled={tancat}
                    className="w-32"
                    {...register(`horari.${day}.obertura`)}
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="time"
                    aria-label={t("fitxa.horari.tancament")}
                    disabled={tancat}
                    className="w-32"
                    {...register(`horari.${day}.tancament`)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="sticky bottom-0 -mx-4 flex justify-end border-t bg-background/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-lg md:border md:px-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? t("form.submitting") : t("fitxa.form.submit")}
        </Button>
      </div>
    </form>
  );
}
