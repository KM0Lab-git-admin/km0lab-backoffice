import { createFileRoute } from "@tanstack/react-router";
import Bescanvis from "@/pages/Bescanvis";

export const Route = createFileRoute("/admin/redemptions")({
  head: () => ({
    meta: [
      { title: "Bescanvis · KM0 LAB" },
      {
        name: "description",
        content:
          "Seguiment de tots els premis bescanviats pels veïns: vals amb QR i lliuraments físics.",
      },
      { property: "og:title", content: "Bescanvis · KM0 LAB" },
      {
        property: "og:description",
        content:
          "Seguiment de tots els premis bescanviats pels veïns: vals amb QR i lliuraments físics.",
      },
    ],
  }),
  component: Bescanvis,
});
