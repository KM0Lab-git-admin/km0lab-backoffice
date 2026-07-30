import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/backoffice/AppLayout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    const roles = useAuthStore.getState().user?.roles ?? [];
    if (!roles.includes("admin")) {
      throw redirect({ to: "/merchant/my-qr" });
    }
    // Leaving merchant acting mode when entering admin area.
    const session = useSessionStore.getState();
    if (session.actingAsShopId) {
      session.exitActingAsShop();
    } else if (session.rol !== "admin") {
      session.setRol("admin");
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
