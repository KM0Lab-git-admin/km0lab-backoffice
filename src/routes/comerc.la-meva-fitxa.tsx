import { createFileRoute } from "@tanstack/react-router";
import LaMevaFitxa from "@/pages/LaMevaFitxa";

export const Route = createFileRoute("/comerc/la-meva-fitxa")({
  head: () => ({
    meta: [
      { title: "La meva fitxa · KM0 LAB Backoffice" },
      {
        name: "description",
        content:
          "Edita la fitxa del teu comerç: imatges, informació, horari i contacte, i comprova com es veurà a l'app.",
      },
      { property: "og:title", content: "La meva fitxa · KM0 LAB Backoffice" },
      {
        property: "og:description",
        content:
          "Gestiona la teva fitxa a KM0 LAB amb vista prèvia en directe de com la veuran els veïns.",
      },
    ],
  }),
  component: LaMevaFitxa,
});
