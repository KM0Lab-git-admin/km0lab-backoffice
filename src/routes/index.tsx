import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      if (useSessionStore.getState().rol === "admin") {
        throw redirect({ to: "/admin/resum" });
      }
      throw redirect({ to: "/comerc/el-meu-qr" });
    }
    throw redirect({ to: "/login" });
  },
});
