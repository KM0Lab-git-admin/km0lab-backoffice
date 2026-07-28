import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/contexts/LangContext";
import type { ComercAdmin, ComercAdminInput } from "@/types/backoffice";

const schema = z.object({
  nom: z.string().min(1),
  emoji: z.string().optional().or(z.literal("")),
  categories: z.string().min(1),
  emailContacte: z.string().email(),
  puntsPerVisita: z.coerce.number().int().positive(),
  adreca: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: ComercAdmin;
  onSubmit: (input: ComercAdminInput) => Promise<unknown> | void;
  onCancel: () => void;
  submitting?: boolean;
};

function parseCategories(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ComercoForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const { t } = useLang();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: initial?.nom ?? "",
      emoji: initial?.emoji ?? "",
      categories: initial?.categories.join(", ") ?? "",
      emailContacte: initial?.emailContacte ?? "",
      puntsPerVisita: initial?.puntsPerVisita ?? 20,
      adreca: initial?.adreca ?? "",
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        nom: initial.nom,
        emoji: initial.emoji ?? "",
        categories: initial.categories.join(", "),
        emailContacte: initial.emailContacte,
        puntsPerVisita: initial.puntsPerVisita,
        adreca: initial.adreca ?? "",
      });
    }
  }, [initial, reset]);

  const isEdit = !!initial;

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const input: ComercAdminInput = {
          nom: values.nom,
          emoji: values.emoji || undefined,
          categories: parseCategories(values.categories),
          emailContacte: values.emailContacte,
          puntsPerVisita: Number(values.puntsPerVisita),
          adreca: values.adreca || undefined,
        };
        return onSubmit(input);
      })}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-[80px_1fr] gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="emoji">{t("comercos.form.emoji.label")}</Label>
          <Input
            id="emoji"
            maxLength={4}
            placeholder="🏪"
            className="text-center text-lg"
            {...register("emoji")}
          />
        </div>
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
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="categories">{t("comercos.form.categories.label")}</Label>
        <Input
          id="categories"
          placeholder={t("comercos.form.categories.placeholder")}
          aria-invalid={!!errors.categories}
          {...register("categories")}
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="adreca">
          {t("comercos.form.adreca.label")}{" "}
          <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
        </Label>
        <Textarea
          id="adreca"
          rows={2}
          placeholder={t("comercos.form.adreca.placeholder")}
          {...register("adreca")}
        />
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
