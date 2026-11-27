import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/Login";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      if (useSessionStore.getState().rol === "admin") {
        throw redirect({ to: "/admin/overview" });
      }
      throw redirect({ to: "/merchant/my-qr" });
    }
  },
  head: () => ({
    meta: [
      { title: "Inicia sessió · KM0 LAB" },
      {
        name: "description",
        content: "Accedeix al backoffice del teu comerç KM0 LAB per gestionar el QR i les promocions.",
      },
      { property: "og:title", content: "Inicia sessió · KM0 LAB" },
      {
        property: "og:description",
        content: "Accedeix al backoffice del teu comerç KM0 LAB.",
      },
    ],
  }),
  component: LoginPage,
});
