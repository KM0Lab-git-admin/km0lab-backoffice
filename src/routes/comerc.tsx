import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/backoffice/AppLayout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";

export const Route = createFileRoute("/comerc")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    if (useSessionStore.getState().rol !== "comerc") {
      useSessionStore.getState().setRol("comerc");
    }
  },
  component: ComercLayout,
});

function ComercLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
