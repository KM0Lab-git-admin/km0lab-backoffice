import { createFileRoute, redirect } from "@tanstack/react-router";
import { homePathForRol } from "@/lib/roles";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: homePathForRol(useSessionStore.getState().rol) });
    }
    throw redirect({ to: "/login" });
  },
});
