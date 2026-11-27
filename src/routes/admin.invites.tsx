import { createFileRoute } from "@tanstack/react-router";
import Invitacions from "@/pages/Invitacions";

export const Route = createFileRoute("/admin/invites")({
  head: () => ({
    meta: [
      { title: "Invitacions · KM0 LAB" },
      {
        name: "description",
        content:
          "Registres completats des d'invitacions de veïns i comerços de la teva població.",
      },
    ],
  }),
  component: Invitacions,
});
