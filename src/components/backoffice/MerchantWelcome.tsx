// First-access welcome card (separable module).
import { useEffect } from "react";
import { CheckCircle2, ChevronRight, Circle, PartyPopper, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";
import type { MessageKey } from "@/lib/i18n";
import type { WelcomeStep, WelcomeStepId } from "@/types/shopRequest";

const stepLabel: Record<WelcomeStepId, MessageKey> = {
  profile: "alta.welcome.step.profile",
  promotion: "alta.welcome.step.promotion",
  poster: "alta.welcome.step.poster",
};

const COMPLETE_HIDE_MS = 2500;

type Props = {
  shopName: string;
  steps: WelcomeStep[];
  loading: boolean;
  error: boolean;
  dismissed: boolean;
  onReload: () => void;
  onDismiss: () => void;
  onReopen: () => void;
  onOpenStep: (id: WelcomeStepId) => void;
};

export function MerchantWelcome({
  shopName,
  steps,
  loading,
  error,
  dismissed,
  onReload,
  onDismiss,
  onReopen,
  onOpenStep,
}: Props) {
  const { t } = useLang();
  const doneCount = steps.filter((s) => s.done).length;
  const complete = !loading && !error && doneCount === steps.length;

  useEffect(() => {
    if (!complete) return;
    const id = setTimeout(onDismiss, COMPLETE_HIDE_MS);
    return () => clearTimeout(id);
  }, [complete, onDismiss]);

  if (dismissed && !complete) {
    return (
      <Button variant="outline" size="sm" onClick={onReopen}>
        <Sparkles className="h-4 w-4" />
        {t("alta.welcome.reopen")}
      </Button>
    );
  }
  if (dismissed) return null;

  if (loading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) return <ErrorState message={t("alta.welcome.error")} onRetry={onReload} />;

  if (complete) {
    return (
      <Card className="border-km0-teal-200 bg-km0-teal-100/40">
        <CardContent className="flex items-center gap-3 p-5">
          <PartyPopper className="h-6 w-6 shrink-0 text-km0-teal-700" />
          <div>
            <p className="font-bold text-km0-teal-700">{t("alta.welcome.complete")}</p>
            <p className="text-sm text-muted-foreground">{t("alta.welcome.completeBody")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-km0-blue-800">
              {t("alta.welcome.greeting").replace("{nom}", shopName)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("alta.welcome.intro")}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} aria-label={t("alta.welcome.close")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("alta.welcome.progress").replace("{n}", String(doneCount))}
        </p>
        <ul className="flex flex-col gap-2">
          {steps.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onOpenStep(s.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted/50",
                  s.done && "bg-muted/30",
                )}
              >
                {s.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-km0-teal-700" aria-label={t("alta.welcome.done")} />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className={cn("flex-1 font-medium", s.done && "text-muted-foreground line-through")}>
                  {t(stepLabel[s.id])}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
