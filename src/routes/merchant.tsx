import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/backoffice/AppLayout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";

export const Route = createFileRoute("/merchant")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    const session = useSessionStore.getState();
    const roles = useAuthStore.getState().user?.roles ?? [];
    const isAdminActing =
      roles.includes("admin") && Boolean(session.actingAsShopId);
    const isMerchant = roles.includes("merchant");

    if (!isMerchant && !isAdminActing) {
      throw redirect({ to: "/admin/merchants" });
    }

    if (session.rol !== "comerc") {
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
