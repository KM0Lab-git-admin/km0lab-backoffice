import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";
import { CATEGORIES_FITXA } from "@/data/fixtures/categoriesFitxa";
import { categoryLabelToSlug } from "@/lib/mappers/categories";
import { adminService } from "@/services/adminService";
import { fitxaService } from "@/services/fitxaService";
import type { MessageKey } from "@/lib/i18n";
import type { ComercAdmin, ComercAdminInput } from "@/types/backoffice";

const schema = z.object({
  nom: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1).max(6),
  emailContacte: z.string().email(),
  puntsPerVisita: z.coerce.number().int().positive(),
  adreca: z.string().optional().or(z.literal("")),
  codiPostal: z.string().optional().or(z.literal("")),
  // Required only when the municipality has several towns (checked on submit).
  localitatId: z.string().optional().or(z.literal("")),
  telefon: z.string().optional().or(z.literal("")),
  web: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: ComercAdmin;
  onSubmit: (input: ComercAdminInput) => Promise<unknown> | void;
  onCancel: () => void;
  submitting?: boolean;
};

export function ComercoForm({ initial, onSubmit, onCancel, submitting }: Props) {
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
    const row = categoriesQ.data?.find((c) => c.slug === slug);
    const label = row?.label ?? t(`shopCategories.${slug}` as MessageKey);
    return row?.emoji ? `${row.emoji} ${label}` : label;
  };

  // Same query the layout and the page already hold: no extra request.
  const meQ = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminService.getMe(),
  });
  const localitats = meQ.data?.localitats ?? [];
  // With a single town the API assigns it: the form stays as it was.
  const calLocalitat = localitats.length > 1;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: initial?.nom ?? "",
      categories: (initial?.categories ?? []).map(categoryLabelToSlug),
      emailContacte: initial?.emailContacte ?? "",
      puntsPerVisita: initial?.puntsPerVisita ?? 20,
      adreca: initial?.adreca ?? "",
      codiPostal: initial?.codiPostal ?? "",
      localitatId: initial?.localitatId ?? "",
      telefon: initial?.telefon ?? "",
      web: initial?.web ?? "",
    },
  });

  // A postal code says which town it is: typing one picks its town. Only on
  // a change by the user, so opening a shop never moves it.
  const codiPostal = watch("codiPostal")?.trim() ?? "";
  const localitatDelCodi = calLocalitat
    ? localitats.find((l) => l.codisPostals.includes(codiPostal))?.id
    : undefined;
  const codiCanviat = !!dirtyFields.codiPostal;
  useEffect(() => {
    if (localitatDelCodi && codiCanviat) {
      setValue("localitatId", localitatDelCodi, { shouldValidate: true });
    }
  }, [localitatDelCodi, codiCanviat, setValue]);

  useEffect(() => {
    if (initial) {
      reset({
        nom: initial.nom,
        categories: initial.categories.map(categoryLabelToSlug),
        emailContacte: initial.emailContacte,
        puntsPerVisita: initial.puntsPerVisita,
        adreca: initial.adreca ?? "",
        codiPostal: initial.codiPostal ?? "",
        localitatId: initial.localitatId ?? "",
        telefon: initial.telefon ?? "",
        web: initial.web ?? "",
      });
    }
  }, [initial, reset]);

  const isEdit = !!initial;

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (calLocalitat && !values.localitatId) {
          setError("localitatId", { type: "required" }, { shouldFocus: true });
          return;
        }
        const input: ComercAdminInput = {
          nom: values.nom,
          categories: values.categories.map(categoryLabelToSlug),
          emailContacte: values.emailContacte,
          puntsPerVisita: Number(values.puntsPerVisita),
          adreca: values.adreca || undefined,
          codiPostal: values.codiPostal || undefined,
          localitatId: calLocalitat ? values.localitatId || undefined : undefined,
          telefon: values.telefon || undefined,
          web: values.web || undefined,
        };
        return onSubmit(input);
      })}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="nom">{t("comercos.form.nom.label")}</Label>
        <Input
          id="nom"
          placeholder={t("comercos.form.nom.placeholder")}
          aria-invalid={!!errors.nom}
          {...register("nom")}
        />
        {errors.nom ? (
          <p className="text-xs text-destructive">{t("form.error.required")}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="categoriesText">{t("comercos.form.categories.label")}</Label>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => {
            const selected = (field.value ?? []).map(categoryLabelToSlug);
            const toggle = (slug: string) => {
              if (selected.includes(slug)) {
                field.onChange(selected.filter((c) => c !== slug));
              } else if (selected.length < 6) {
                field.onChange([...selected, slug]);
              }
            };
            const remove = (slug: string) =>
              field.onChange(selected.filter((c) => c !== slug));
            const countLabel = t("comercos.form.categories.count").replace(
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
                          ? t("comercos.form.categories.placeholder")
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
                        placeholder={t("comercos.form.categories.search")}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {t("comercos.form.categories.empty")}
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
                          <Badge variant="secondary" className="gap-1 pr-1">
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
          {t("comercos.form.categories.hint")}
        </p>
        {errors.categories ? (
          <p className="text-xs text-destructive">{t("form.error.required")}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="emailContacte">{t("comercos.form.email.label")}</Label>
        <Input
          id="emailContacte"
          type="email"
          placeholder={t("comercos.form.email.placeholder")}
          aria-invalid={!!errors.emailContacte}
          {...register("emailContacte")}
        />
        <p className="text-xs text-muted-foreground">
          {isEdit
            ? t("comercos.form.email.hintEdit")
            : t("comercos.form.email.hintNew")}
        </p>
        {errors.emailContacte ? (
          <p className="text-xs text-destructive">{t("comercos.form.email.error")}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="puntsPerVisita">{t("comercos.form.punts.label")}</Label>
        <Input
          id="puntsPerVisita"
          type="number"
          min={1}
          step={1}
          aria-invalid={!!errors.puntsPerVisita}
          {...register("puntsPerVisita")}
        />
        <p className="text-xs text-muted-foreground">
          {t("comercos.form.punts.hint")}
        </p>
        {errors.puntsPerVisita ? (
          <p className="text-xs text-destructive">
            {t("comercos.form.punts.error")}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">{t("comercos.form.contact.title")}</p>
        {calLocalitat ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="localitatId">{t("comercos.form.localitat.label")}</Label>
            <Controller
              name="localitatId"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="localitatId"
                    ref={field.ref}
                    aria-invalid={!!errors.localitatId}
                  >
                    <SelectValue placeholder={t("comercos.form.localitat.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {localitats.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">{t("comercos.form.localitat.hint")}</p>
            {errors.localitatId ? (
              <p className="text-xs text-destructive">{t("form.error.required")}</p>
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          <Label htmlFor="adreca">
            {t("comercos.form.adreca.label")}{" "}
            <span className="text-xs text-muted-foreground">
              ({t("common.optional")})
            </span>
          </Label>
          <Input
            id="adreca"
            placeholder={t("comercos.form.adreca.placeholder")}
            {...register("adreca")}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="codiPostal">
              {t("comercos.form.codiPostal.label")}{" "}
              <span className="text-xs text-muted-foreground">
                ({t("common.optional")})
              </span>
            </Label>
            <Input
              id="codiPostal"
              placeholder={t("comercos.form.codiPostal.placeholder")}
              {...register("codiPostal")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="telefon">
              {t("comercos.form.telefon.label")}{" "}
              <span className="text-xs text-muted-foreground">
                ({t("common.optional")})
              </span>
            </Label>
            <Input
              id="telefon"
              inputMode="tel"
              placeholder={t("comercos.form.telefon.placeholder")}
              {...register("telefon")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="web">
            {t("comercos.form.web.label")}{" "}
            <span className="text-xs text-muted-foreground">
              ({t("common.optional")})
            </span>
          </Label>
          <Input
            id="web"
            placeholder={t("comercos.form.web.placeholder")}
            {...register("web")}
          />
        </div>
      </div>

      {!isEdit ? (
        <div className="rounded-md border bg-km0-yellow-100/60 p-3 text-xs text-km0-blue-800">
          {t("comercos.form.inviteHint")}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? t("form.submitting")
            : isEdit
              ? t("comercos.form.submit.edit")
              : t("comercos.form.submit.new")}
        </Button>
      </div>
    </form>
  );
}
