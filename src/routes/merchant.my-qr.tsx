import { createFileRoute } from "@tanstack/react-router";
import ElMeuQR from "@/pages/ElMeuQR";

export const Route = createFileRoute("/merchant/my-qr")({
  head: () => ({
    meta: [
      { title: "El meu QR · KM0 LAB Backoffice" },
      {
        name: "description",
        content:
          "Consulta i descarrega el QR de punts del teu comerç, revisa les mètriques de visites i punts atorgats.",
      },
      { property: "og:title", content: "El meu QR · KM0 LAB Backoffice" },
      {
        property: "og:description",
        content: "Descarrega, imprimeix i comparteix el QR únic del teu comerç adherit a KM0 LAB.",
      },
    ],
  }),
  component: ElMeuQR,
});
