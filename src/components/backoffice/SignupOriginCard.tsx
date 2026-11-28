import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { signupProviderKey } from "@/components/backoffice/SignupProviderBadge";
import { useLang } from "@/contexts/LangContext";
import type { SignupProvider, SignupsByProvider } from "@/types/backoffice";

const ORDER: SignupProvider[] = ["email_code", "google", "facebook", "apple"];

export type SignupRow = { provider: SignupProvider; count: number; pct: number };

// Presentation only: whole-number percentages.
export function signupRows(data: SignupsByProvider): { total: number; rows: SignupRow[] } {
  const total = ORDER.reduce((sum, p) => sum + data[p], 0);
  return {
    total,
    rows: ORDER.map((provider) => ({
      provider,
      count: data[provider],
      pct: total === 0 ? 0 : Math.round((data[provider] / total) * 100),
    })),
  };
}

type Props = {
  loading: boolean;
  error: boolean;
  data: SignupsByProvider | undefined;
  onRetry: () => void;
};

export function SignupOriginCard({ loading, error, data, onRetry }: Props) {
  const { t, lang } = useLang();
  const locale = lang === "en" ? "en-GB" : lang;
  const summary = data ? signupRows(data) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("origen.card.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("origen.card.subtitle")}</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {ORDER.map((p) => (
              <Skeleton key={p} className="h-8 w-full" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={t("origen.card.error")} onRetry={onRetry} />
        ) : !summary || summary.total === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t("origen.card.empty")}
          </p>
        ) : (
          <ul className="space-y-3">
            {summary.rows.map((r) => (
              <li key={r.provider} className="grid grid-cols-[6rem_1fr_auto] items-center gap-3 text-sm">
                <span className="font-medium">{t(signupProviderKey[r.provider])}</span>
                <Progress value={r.pct} className="h-2" data-testid="signup-bar" aria-label={t(signupProviderKey[r.provider])} />
                <span className="tabular-nums text-muted-foreground">
                  {r.count.toLocaleString(locale)} · {r.pct}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
