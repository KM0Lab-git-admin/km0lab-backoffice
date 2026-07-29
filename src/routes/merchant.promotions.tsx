import { createFileRoute } from "@tanstack/react-router";
import Promocions from "@/pages/Promocions";

export const Route = createFileRoute("/merchant/promotions")({
  head: () => ({
    meta: [
      { title: "Promocions · KM0 LAB Backoffice" },
      {
        name: "description",
        content: "Gestiona les promocions informatives del teu comerç: crea, edita i activa.",
      },
      { property: "og:title", content: "Promocions · KM0 LAB Backoffice" },
      {
        property: "og:description",
        content: "Crea i administra les promocions que veuran els veïns a la fitxa del teu comerç.",
      },
    ],
  }),
  component: Promocions,
});
