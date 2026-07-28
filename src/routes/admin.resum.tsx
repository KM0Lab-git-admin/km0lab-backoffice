import { createFileRoute } from "@tanstack/react-router";
import AdminResumPage from "@/pages/AdminResum";

export const Route = createFileRoute("/admin/resum")({
  head: () => ({
    meta: [
      { title: "Resum · KM0 LAB" },
      {
        name: "description",
        content: "Panoràmica del programa de fidelització KM0 LAB de la teva població.",
      },
      { property: "og:title", content: "Resum · KM0 LAB" },
      {
        property: "og:description",
        content: "Panoràmica del programa de fidelització KM0 LAB.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminResumPage,
});
