import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Printer, RefreshCw } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { qrService } from "@/services/qrService";
import { comercService } from "@/services/comercService";
import { ErrorState } from "@/components/backoffice/ErrorState";

/*
 * Production page (locked in scripts/lovable-manifest.json).
 *
 * The prototype draws a decorative grid that only looks like a QR. Here the
 * picture is the real one from the API (`png_url`): what the shop sees on
 * screen, photographs or prints is what a resident's phone can read.
 *
 * Printing: the poster is rendered straight under <body> and, when printing,
 * it is the only thing left on the page. No pop-up window (browsers block
 * them) and no PDF library: the print dialog already saves as PDF.
 */
const POSTER_ID = "qr-poster";
const POSTER_PRINT_CSS = `
#${POSTER_ID} { display: none; }
@media print {
  @page { margin: 14mm; }
  body > *:not(#${POSTER_ID}) { display: none !important; }
  #${POSTER_ID} {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9mm;
    min-height: 225mm;
    text-align: center;
    color: #000;
    background: #fff;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  #${POSTER_ID} h1 { font-size: 34pt; font-weight: 800; line-height: 1.1; margin: 0; }
  #${POSTER_ID} img { width: 120mm; height: 120mm; image-rendering: pixelated; }
  #${POSTER_ID} .shop { font-size: 22pt; font-weight: 700; margin: 0; }
  #${POSTER_ID} .how { font-size: 14pt; max-width: 130mm; margin: 0; }
  #${POSTER_ID} .brand { font-size: 11pt; font-weight: 700; letter-spacing: 0.08em; margin: 0; }
}
`;

export default function ElMeuQRPage() {
  const { t } = useLang();

  const comercQ = useQuery({ queryKey: ["comerc", "me"], queryFn: () => comercService.getMe() });
  const qrQ = useQuery({ queryKey: ["qr", "me"], queryFn: () => qrService.getMyQRPage() });

  // The poster hangs from <body>, which only exists in the browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const loading = comercQ.isLoading || qrQ.isLoading;
  const error = comercQ.error || qrQ.error;
  const qr = qrQ.data?.qr;
  const metrics = qrQ.data?.metrics;
  const ready = Boolean(qr?.pngUrl && comercQ.data);

  if (error) {
    return (
      <ErrorState
        onRetry={() => {
          comercQ.refetch();
          qrQ.refetch();
        }}
      />
    );
  }

  const handleDownload = async () => {
    try {
      await qrService.downloadPNG();
      toast.success(t("qr.toast.downloaded"));
    } catch {
      toast.error(t("qr.toast.error"));
    }
  };

  // Synchronous on purpose: called from the click, so no browser blocks it.
  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t("qr.title")}</h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">{t("qr.subtitle")}</p>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {loading || !metrics ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            <MetricCard value={metrics.visites.toLocaleString()} label={t("qr.metrics.visits")} />
            <MetricCard
              value={metrics.puntsAtorgats.toLocaleString()}
              label={t("qr.metrics.points")}
            />
          </>
        )}
      </section>

      {/* QR panel */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center gap-4 bg-gradient-to-b from-white to-km0-beige-50 p-6">
            {loading || !qr?.pngUrl || !comercQ.data ? (
              <Skeleton className="h-[240px] w-[240px]" />
            ) : (
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <img
                  src={qr.pngUrl}
                  alt={t("qr.alt")}
                  width={220}
                  height={220}
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            )}
            {qr && comercQ.data ? (
              <div className="text-center">
                <p className="text-sm font-bold text-km0-blue-800">{comercQ.data.nom}</p>
                <p className="text-xs font-semibold text-km0-blue-400">
                  +{qr.puntsPerVisita} {t("qr.pointsPerVisit")}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <div>
              <h2 className="text-lg font-bold text-km0-blue-800">{t("qr.download.title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("qr.download.pdfHint")}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handlePrint} disabled={!ready}>
                <Printer className="h-4 w-4" />
                {t("qr.download.print")}
              </Button>
              <Button variant="outline" onClick={handleDownload} disabled={!ready}>
                <Download className="h-4 w-4" />
                {t("qr.download.png")}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">{t("qr.download.pngHint")}</p>

            <div className="rounded-xl border border-dashed border-km0-blue-400 bg-km0-blue-50 p-4 text-sm leading-relaxed text-km0-blue-700">
              🔒 {t("qr.note")}
            </div>

            <div>
              <Button variant="ghost" size="sm" disabled>
                <RefreshCw className="h-4 w-4" />
                {t("qr.regenerate")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {mounted && ready && qr?.pngUrl && comercQ.data
        ? createPortal(
            <div id={POSTER_ID}>
              <style>{POSTER_PRINT_CSS}</style>
              <h1>{t("qr.poster.title")}</h1>
              <img src={qr.pngUrl} alt={t("qr.alt")} />
              <p className="shop">{comercQ.data.nom}</p>
              <p className="how">{t("qr.poster.how")}</p>
              <p className="brand">{t("app.brand")}</p>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function MetricCard({ value, label, trend }: { value: string; label: string; trend?: boolean }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-5">
        <p className="text-3xl font-black tracking-tight text-km0-blue-800">
          {value}
          {trend ? <span className="ml-1 text-sm font-bold text-km0-green-500">▲</span> : null}
        </p>
        <p className="text-xs font-semibold text-km0-blue-500">{label}</p>
      </CardContent>
    </Card>
  );
}
