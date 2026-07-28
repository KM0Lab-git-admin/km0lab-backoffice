import { createFileRoute } from "@tanstack/react-router";
import Comercos from "@/pages/Comercos";

export const Route = createFileRoute("/admin/comercos")({
  head: () => ({
    meta: [
      { title: "Comerços · KM0 LAB" },
      {
        name: "description",
        content:
          "Gestiona els comerços adherits a KM0 LAB de la teva població: alta, invitació i estat.",
      },
      { property: "og:title", content: "Comerços · KM0 LAB" },
      {
        property: "og:description",
        content:
          "Gestiona els comerços adherits a KM0 LAB de la teva població: alta, invitació i estat.",
      },
    ],
  }),
  component: Comercos,
});
