import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LangContext";
import { AlertTriangle } from "lucide-react";

type Props = {
  onRetry?: () => void;
  message?: string;
};

export function ErrorState({ onRetry, message }: Props) {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold">{t("common.error")}</h3>
      {message ? <p className="mt-1 text-sm text-muted-foreground">{message}</p> : null}
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} variant="outline">
          {t("common.retry")}
        </Button>
      ) : null}
    </div>
  );
}
