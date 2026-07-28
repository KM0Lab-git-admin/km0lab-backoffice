import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegistrePage } from "@/pages/Registre";
import { homePathForRol } from "@/lib/roles";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";

export const Route = createFileRoute("/registre")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: homePathForRol(useSessionStore.getState().rol) });
    }
  },
  head: () => ({
    meta: [
      { title: "Registra el teu comerç · KM0 LAB" },
      {
        name: "description",
        content:
          "Uneix el teu comerç a KM0 LAB i comença a fidelitzar els veïns del teu barri.",
      },
      { property: "og:title", content: "Registra el teu comerç · KM0 LAB" },
      {
        property: "og:description",
        content:
          "Uneix el teu comerç a KM0 LAB i comença a fidelitzar els veïns del teu barri.",
      },
    ],
  }),
  component: RegistrePage,
});
