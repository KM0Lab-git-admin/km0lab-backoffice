import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Printer, FileText, RefreshCw } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { qrService } from "@/services/qrService";
import { comercService } from "@/services/comercService";
import { QRMock } from "@/components/backoffice/QRMock";
import { ErrorState } from "@/components/backoffice/ErrorState";

export default function ElMeuQRPage() {
  const { t } = useLang();
  const qc = useQueryClient();

  const comercQ = useQuery({
    queryKey: ["comerc", "me"],
    queryFn: () => comercService.getMe(),
  });
  const qrQ = useQuery({
    queryKey: ["qr", "me"],
    queryFn: () => qrService.getMyQR(),
  });
  const metricsQ = useQuery({
    queryKey: ["qr", "metrics"],
    queryFn: () => qrService.getMetrics(),
  });

  const loading = comercQ.isLoading || qrQ.isLoading || metricsQ.isLoading;
  const error = comercQ.error || qrQ.error || metricsQ.error;

  if (error) {
    return (
      <ErrorState
        onRetry={() => {
          comercQ.refetch();
          qrQ.refetch();
          metricsQ.refetch();
        }}
      />
    );
  }

  const handleDownload = async (kind: "pdf" | "png") => {
    try {
      if (kind === "pdf") await qrService.downloadPDF();
      else await qrService.downloadPNG();
      toast.success(t("qr.toast.downloaded"));
    } catch {
      toast.error(t("login.error.generic"));
    }
  };

  const handlePrint = async () => {
    try {
      await qrService.print();
      toast(t("qr.toast.printed"));
    } catch {
      toast.error(t("login.error.generic"));
    }
  };

  const handleRegenerate = async () => {
    try {
      await qrService.regenerate();
      await qc.invalidateQueries({ queryKey: ["qr"] });
      toast.success(t("qr.toast.downloaded"));
    } catch {
      toast.error(t("login.error.generic"));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("qr.title")}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
          {t("qr.subtitle")}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {loading || !metricsQ.data ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            <MetricCard
              value={metricsQ.data.visites.toLocaleString()}
              label={t("qr.metrics.visits")}
            />
            <MetricCard
              value={metricsQ.data.puntsAtorgats.toLocaleString()}
              label={t("qr.metrics.points")}
            />
          </>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center gap-4 bg-gradient-to-b from-white to-km0-beige-50 p-6">
            {loading || !qrQ.data || !comercQ.data ? (
              <Skeleton className="h-[240px] w-[240px]" />
            ) : (
              <div className="rounded-xl border bg-white p-4 text-km0-blue-800 shadow-sm">
                {qrQ.data.pngUrl ? (
                  <img
                    src={qrQ.data.pngUrl}
                    alt={`QR ${qrQ.data.codi}`}
                    width={220}
                    height={220}
                    className="h-[220px] w-[220px]"
                  />
                ) : (
                  <QRMock value={qrQ.data.codi} size={220} />
                )}
              </div>
            )}
            {qrQ.data && comercQ.data ? (
              <div className="text-center">
                <p className="text-sm font-bold text-km0-blue-800">
                  {comercQ.data.nom}
                </p>
                <p className="text-xs font-semibold text-km0-blue-400">
                  ID: {qrQ.data.codi} · +{qrQ.data.puntsPerVisita}{" "}
                  {t("qr.pointsPerVisit")}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <div>
              <h2 className="text-lg font-bold text-km0-blue-800">
                {t("qr.download.title")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("qr.download.pdfHint")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleDownload("pdf")} disabled={loading}>
                <FileText className="h-4 w-4" />
                {t("qr.download.pdf")}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownload("png")}
                disabled={loading}
              >
                <Download className="h-4 w-4" />
                {t("qr.download.png")}
              </Button>
              <Button
                variant="secondary"
                onClick={handlePrint}
                disabled={loading}
              >
                <Printer className="h-4 w-4" />
                {t("qr.download.print")}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              {t("qr.download.pngHint")}
            </p>

            <div className="rounded-xl border border-dashed border-km0-blue-400 bg-km0-blue-50 p-4 text-sm leading-relaxed text-km0-blue-700">
              🔒 {t("qr.note")}
            </div>

            <div>
              <Button
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={handleRegenerate}
              >
                <RefreshCw className="h-4 w-4" />
                {t("qr.regenerate")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({
  value,
  label,
  trend,
}: {
  value: string;
  label: string;
  trend?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-5">
        <p className="text-3xl font-black tracking-tight text-km0-blue-800">
          {value}
          {trend ? (
            <span className="ml-1 text-sm font-bold text-km0-green-500">▲</span>
          ) : null}
        </p>
        <p className="text-xs font-semibold text-km0-blue-500">{label}</p>
      </CardContent>
    </Card>
  );
}
