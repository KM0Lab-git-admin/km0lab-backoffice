import { Clock, LogOut, Mail, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LangSwitcher } from "@/components/backoffice/LangSwitcher";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { useLang } from "@/contexts/LangContext";
import type { SessionShopRequest } from "@/types/shopRequest";

type Props = {
  state: "loading" | "error" | "ready";
  request: SessionShopRequest | undefined;
  supportEmail: string;
  onSignOut: () => void;
  onRetry: () => void;
};

export function ShopRequestStatus({ state, request, supportEmail, onSignOut, onRetry }: Props) {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-8">
        <header className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-md bg-km0-blue-700 px-2.5 py-1 text-sm font-black tracking-wide text-km0-beige-100">
            {t("app.brand")}
          </span>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("auth.signOut")}</span>
            </Button>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            {state === "loading" ? (
              <div className="space-y-4 rounded-2xl border bg-card p-6 md:p-8">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : state === "error" ? (
              <ErrorState message={t("alta.status.error")} onRetry={onRetry} />
            ) : request ? (
              <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                {request.status === "review" ? (
                  <ReviewBody request={request} supportEmail={supportEmail} />
                ) : (
                  <RejectedBody request={request} supportEmail={supportEmail} />
                )}
                <Button variant="outline" className="w-full" onClick={onSignOut}>
                  <LogOut className="h-4 w-4" />
                  {t("auth.signOut")}
                </Button>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

type BodyProps = { request: NonNullable<SessionShopRequest>; supportEmail: string };

function ReviewBody({ request, supportEmail }: BodyProps) {
  const { t } = useLang();
  return (
    <>
      <div className="space-y-2">
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          {t("alta.status.review.badge")}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">{request.name}</h1>
        <p className="text-base font-semibold text-km0-blue-800">{t("alta.status.review.title")}</p>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>{t("alta.status.review.call")}</li>
        {request.expectedDays ? (
          <li>{t("alta.status.review.eta").replace("{days}", String(request.expectedDays))}</li>
        ) : null}
        <li>{t("alta.status.review.hidden")}</li>
      </ul>
      <p className="flex items-center gap-2 text-sm">
        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span>{t("alta.status.help").replace("{email}", supportEmail)}</span>
      </p>
    </>
  );
}

function RejectedBody({ request, supportEmail }: BodyProps) {
  const { t } = useLang();
  return (
    <>
      <div className="space-y-2">
        <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
          <XCircle className="h-3 w-3" />
          {t("alta.status.rejected.badge")}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">{request.name}</h1>
        <p className="text-base font-semibold text-km0-blue-800">{t("alta.status.rejected.title")}</p>
      </div>
      {request.rejectionReason ? (
        <Alert>
          <AlertTitle>{t("alta.status.rejected.reasonLabel")}</AlertTitle>
          <AlertDescription className="whitespace-pre-line">{request.rejectionReason}</AlertDescription>
        </Alert>
      ) : (
        <p className="text-sm text-muted-foreground">{t("alta.status.rejected.reasonByEmail")}</p>
      )}
      <p className="text-sm">{t("alta.status.rejected.mistake").replace("{email}", supportEmail)}</p>
      <p className="text-xs text-muted-foreground">{t("alta.status.rejected.deletion")}</p>
    </>
  );
}
