import { createFileRoute } from "@tanstack/react-router";
import Vals from "@/pages/Vals";

export const Route = createFileRoute("/comerc/vals")({
  head: () => ({
    meta: [
      { title: "Validar vals · KM0 LAB Backoffice" },
      {
        name: "description",
        content:
          "Valida els codis de 5 dígits dels vals dels veïns i consulta l'historial i l'estat de cobrament via Bizum.",
      },
      { property: "og:title", content: "Validar vals · KM0 LAB Backoffice" },
      {
        property: "og:description",
        content:
          "Aplica descomptes al moment introduint el codi del val i controla els cobraments pendents del teu comerç.",
      },
    ],
  }),
  component: Vals,
});
