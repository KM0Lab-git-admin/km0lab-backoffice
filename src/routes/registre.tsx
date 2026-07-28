import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegistrePage } from "@/pages/Registre";
import { useAuthStore } from "@/stores/useAuthStore";

export const Route = createFileRoute("/registre")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/comerc/el-meu-qr" });
    }
  },
  head: () => ({
    meta: [
      { title: "Registra el teu comerç · KM0 LAB" },
      {
        name: "description",
        content: "Uneix el teu comerç a KM0 LAB i comença a fidelitzar els veïns del teu barri.",
      },
      { property: "og:title", content: "Registra el teu comerç · KM0 LAB" },
      {
        property: "og:description",
        content: "Uneix el teu comerç a KM0 LAB i comença a fidelitzar els veïns del teu barri.",
      },
    ],
  }),
  component: RegistrePage,
});
