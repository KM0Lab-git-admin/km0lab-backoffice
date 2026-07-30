import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "@/components/backoffice/ImageUploader";
import { I18nField } from "@/components/backoffice/I18nField";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";
import { normalizeLang, pickPlain, seedI18n } from "@/types/i18n";
import { CATEGORIES_FITXA } from "@/data/fixtures/categoriesFitxa";
import { categoryLabelToSlug } from "@/lib/mappers/categories";
import { fitxaService } from "@/services/fitxaService";
import type { MessageKey } from "@/lib/i18n";
import type {
  ComercFitxa,
  ComercFitxaInput,
  DiaSetmana,
  HorariDia,
} from "@/types/merchant";

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
const optionalTime = z
  .string()
  .regex(timePattern)
  .or(z.literal(""))
  .optional();

const horariDiaSchema: z.ZodType<HorariDia> = z
  .object({
    tancat: z.boolean(),
    obertura: z.string().regex(timePattern),
    tancament: z.string().regex(timePattern),
    obertura2: optionalTime,
    tancament2: optionalTime,
  })
  .superRefine((d, ctx) => {
    if (d.tancat) return;
    const a = (d.obertura2 ?? "").trim();
    const b = (d.tancament2 ?? "").trim();
    if ((a && !b) || (!a && b)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "split",
        path: a ? ["tancament2"] : ["obertura2"],
      });
    }
  });

const schema = z.object({
  nom: z.string().trim().min(1).max(80),
  categories: z.array(z.string().min(1)).min(1).max(6),
  descripcio: z.string().trim().max(400).optional().or(z.literal("")),
  descripcioI18n: z.object({
    ca: z.string().optional(),
    es: z.string().optional(),
    en: z.string().optional(),
  }),
  idiomaOrigen: z.enum(["ca", "es", "en"]),
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
  const origen = normalizeLang(f.idiomaOrigen);
  return {
    nom: f.nom,
    categories: [...f.categories],
    descripcio: f.descripcio,
    descripcioI18n: seedI18n(f.descripcio, origen, f.descripcioI18n),
    idiomaOrigen: origen,
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
  const origen = v.idiomaOrigen;
  return {
    nom: v.nom,
    categories: v.categories,
    descripcio: pickPlain(v.descripcioI18n, origen, v.descripcio),
    descripcioI18n: v.descripcioI18n,
    idiomaOrigen: origen,
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
  const { t, lang } = useLang();
  const categoriesQ = useQuery({
    queryKey: ["shop-categories", lang],
    queryFn: () => fitxaService.listCategories(lang),
    staleTime: 60_000,
  });
  const categoryOptions =
    categoriesQ.data?.map((c) => c.slug) ?? [...CATEGORIES_FITXA];
  const categoryLabel = (slugOrLabel: string) => {
    const slug = categoryLabelToSlug(slugOrLabel);
    const fromApi = categoriesQ.data?.find((c) => c.slug === slug)?.label;
    if (fromApi) return fromApi;
    return t(`shopCategories.${slug}` as MessageKey);
  };
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
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
          <Controller
            name="categories"
            control={control}
            render={({ field }) => {
              const selected = (field.value ?? []).map(categoryLabelToSlug);
              const toggle = (slug: string) => {
                if (selected.includes(slug)) {
                  field.onChange(selected.filter((c) => c !== slug));
                } else {
                  field.onChange([...selected, slug]);
                }
              };
              const remove = (slug: string) =>
                field.onChange(selected.filter((c) => c !== slug));
              const countLabel = t("fitxa.categories.count").replace(
                "{{count}}",
                String(selected.length),
              );
              return (
                <div className="flex flex-col gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="categoriesText"
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-invalid={!!errors.categories}
                        className={cn(
                          "h-10 justify-between font-normal",
                          selected.length === 0 && "text-muted-foreground",
                        )}
                      >
                        <span className="truncate">
                          {selected.length === 0
                            ? t("fitxa.categories.placeholder")
                            : countLabel}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[--radix-popover-trigger-width] p-0"
                    >
                      <Command>
                        <CommandInput
                          placeholder={t("fitxa.categories.search")}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {t("fitxa.categories.empty")}
                          </CommandEmpty>
                          <CommandGroup>
                            {categoryOptions.map((slug) => {
                              const checked = selected.includes(slug);
                              const label = categoryLabel(slug);
                              return (
                                <CommandItem
                                  key={slug}
                                  value={label}
                                  onSelect={() => toggle(slug)}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    checked={checked}
                                    aria-hidden
                                    tabIndex={-1}
                                    className="pointer-events-none"
                                  />
                                  <span>{label}</span>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selected.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {selected.map((cat) => {
                        const label = categoryLabel(cat);
                        return (
                          <li key={cat}>
                            <Badge
                              variant="secondary"
                              className="gap-1 pr-1"
                            >
                              {label}
                              <button
                                type="button"
                                onClick={() => remove(cat)}
                                className="inline-flex h-4 w-4 items-center justify-center rounded-sm hover:bg-muted-foreground/20"
                                aria-label={label}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            }}
          />
          <p className="text-xs text-muted-foreground">
            {t("fitxa.categories.hint")}
          </p>
          {errors.categories ? (
            <p className="text-xs text-destructive">
              {t("form.error.required")}
            </p>
          ) : null}
        </div>

        <Controller
          control={control}
          name="descripcioI18n"
          render={({ field }) => (
            <I18nField
              id="descripcio"
              label={t("fitxa.descripcio.label")}
              value={field.value}
              sourceLang={watch("idiomaOrigen")}
              onChange={field.onChange}
              onSourceLangChange={(nextLang) => setValue("idiomaOrigen", nextLang)}
              multiline
              rows={3}
            />
          )}
        />
        <p className="text-xs text-muted-foreground">
          {t("fitxa.descripcio.hint")}
        </p>
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
            <Input
              id="poblacio"
              readOnly
              disabled
              className="bg-muted"
              {...register("poblacio")}
            />
            <p className="text-xs text-muted-foreground">
              {t("fitxa.poblacio.hint")}
            </p>
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
          <p className="text-xs text-muted-foreground">
            {t("fitxa.horari.splitHint")}
          </p>
        </header>
        <ul className="flex flex-col gap-2">
          {dayOrder.map((day) => {
            const key = `fitxa.day.${day}` as MessageKey;
            const tancat = watch(`horari.${day}.tancat`);
            return (
              <li
                key={day}
                className="flex flex-col gap-2 rounded-lg border bg-card p-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                  <div className="flex flex-wrap items-center gap-2">
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
                </div>
                {!tancat ? (
                  <div className="flex flex-wrap items-center gap-2 sm:pl-28">
                    <span className="text-xs text-muted-foreground">
                      {t("fitxa.horari.tram2")}
                    </span>
                    <Input
                      type="time"
                      aria-label={t("fitxa.horari.obertura2")}
                      className="w-32"
                      {...register(`horari.${day}.obertura2`)}
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                      type="time"
                      aria-label={t("fitxa.horari.tancament2")}
                      className="w-32"
                      {...register(`horari.${day}.tancament2`)}
                    />
                  </div>
                ) : null}
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
