import { createFileRoute } from "@tanstack/react-router";
import Usuaris from "@/pages/Usuaris";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Usuaris · KM0 LAB" },
      {
        name: "description",
        content:
          "Consulta els veïns inscrits al programa de punts de la teva població: activitat, nivell i bescanvis.",
      },
      { property: "og:title", content: "Usuaris · KM0 LAB" },
      {
        property: "og:description",
        content:
          "Consulta els veïns inscrits al programa de punts de la teva població: activitat, nivell i bescanvis.",
      },
    ],
  }),
  component: Usuaris,
});
