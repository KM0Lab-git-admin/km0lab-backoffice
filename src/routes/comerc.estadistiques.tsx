import { createFileRoute } from "@tanstack/react-router";
import Estadistiques from "@/pages/Estadistiques";

export const Route = createFileRoute("/comerc/estadistiques")({
  head: () => ({
    meta: [
      { title: "Estadístiques · KM0 LAB Backoffice" },
      {
        name: "description",
        content:
          "Consulta el rendiment del teu QR i les teves promocions: escanejos, visitants únics, hàbits i clients recurrents.",
      },
      { property: "og:title", content: "Estadístiques · KM0 LAB Backoffice" },
      {
        property: "og:description",
        content:
          "Descobreix qui et visita i què crida més l'atenció al teu comerç adherit a KM0 LAB.",
      },
    ],
  }),
  component: Estadistiques,
});
