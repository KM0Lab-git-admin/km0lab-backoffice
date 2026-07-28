import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/backoffice/AppLayout";
import { homePathForRol } from "@/lib/roles";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    const { rol } = useSessionStore.getState();
    if (rol !== "admin") {
      throw redirect({ to: homePathForRol(rol) });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
