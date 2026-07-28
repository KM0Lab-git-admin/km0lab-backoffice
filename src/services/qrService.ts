import { comercQRFixture, qrMetricsFixture } from "@/data/fixtures/promocions";
import type { ComercQR, QRMetrics } from "@/types/comerc";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms + Math.random() * 200));

export const qrService = {
  async getMyQR(): Promise<ComercQR> {
    await delay(400);
    return comercQRFixture;
  },
  async getMetrics(): Promise<QRMetrics> {
    await delay(500);
    return qrMetricsFixture;
  },
  // Placeholders: production will implement without touching the UI.
  async downloadPDF(): Promise<void> {
    await delay(300);
  },
  async downloadPNG(): Promise<void> {
    await delay(300);
  },
  async print(): Promise<void> {
    await delay(300);
  },
  async regenerate(): Promise<ComercQR> {
    await delay(600);
    return comercQRFixture;
  },
};
