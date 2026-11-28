import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { useLang } from "@/contexts/LangContext";
import type { Lang } from "@/lib/i18n";
import { translate } from "@/lib/i18n";

// Empty = no limit; otherwise a whole number >= 1.
export const pilotLimitSchema = z.object({
  maxResidents: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+$/.test(v) && Number(v) >= 1)),
});

export function parsePilotLimit(value: string): number | null {
  const v = value.trim();
  return v === "" ? null : Number(v);
}

export function pilotCountLabel(residents: number, max: number | null, lang: Lang): string {
  return max === null
    ? translate("alta.pilot.countNoLimit", lang).replace("{n}", String(residents))
    : translate("alta.pilot.count", lang).replace("{n}", String(residents)).replace("{m}", String(max));
}

type Props = {
  loading: boolean;
  error: boolean;
  maxResidents: number | null;
  residentsCount: number;
  saving: boolean;
  // Rejects when saving fails; the field then goes back to the previous value.
  onSave: (maxResidents: number | null) => Promise<unknown>;
  onRetry: () => void;
};

export function PilotLimitField({ loading, error, maxResidents, residentsCount, saving, onSave, onRetry }: Props) {
  const { t, lang } = useLang();
  const form = useForm<z.infer<typeof pilotLimitSchema>>({
    resolver: zodResolver(pilotLimitSchema),
    defaultValues: { maxResidents: maxResidents === null ? "" : String(maxResidents) },
  });

  useEffect(() => {
    form.reset({ maxResidents: maxResidents === null ? "" : String(maxResidents) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxResidents]);

  const save = form.handleSubmit(async (v) => {
    try {
      await onSave(parsePilotLimit(v.maxResidents));
    } catch {
      form.reset({ maxResidents: maxResidents === null ? "" : String(maxResidents) });
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-km0-blue-700" />
          <CardTitle className="text-base">{t("alta.pilot.title")}</CardTitle>
        </div>
        <CardDescription>{t("alta.pilot.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <Skeleton className="h-10 w-full max-w-sm" />
        ) : error ? (
          <ErrorState message={t("alta.pilot.loadError")} onRetry={onRetry} />
        ) : (
          <>
            <Label htmlFor="maxResidents">{t("alta.pilot.title")}</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                id="maxResidents"
                inputMode="numeric"
                placeholder={t("alta.pilot.placeholder")}
                className="sm:max-w-40"
                aria-invalid={!!form.formState.errors.maxResidents}
                {...form.register("maxResidents")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    save();
                  }
                }}
              />
              <span className="text-sm font-semibold tabular-nums text-km0-blue-800">
                {pilotCountLabel(residentsCount, maxResidents, lang)}
              </span>
              <Button type="button" variant="outline" className="sm:ml-auto" disabled={saving} onClick={() => save()}>
                {saving ? t("alta.pilot.saving") : t("alta.pilot.save")}
              </Button>
            </div>
            {form.formState.errors.maxResidents ? (
              <p className="text-sm text-destructive">{t("alta.pilot.error.min")}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">{t("alta.pilot.help")}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
