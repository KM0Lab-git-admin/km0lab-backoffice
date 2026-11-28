import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/backoffice/AppLayout";
import { ShopRequestStatus } from "@/components/backoffice/ShopRequestStatus";
import { MerchantWelcome } from "@/components/backoffice/MerchantWelcome";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { useShopRequestSession } from "@/hooks/useShopRequestSession";
import { useMerchantWelcome } from "@/hooks/useMerchantWelcome";
import { comercService } from "@/services/comercService";
import { SUPPORT_EMAIL } from "@/data/supportContact";

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
    // Whoever asked to register a shop gets in to see where it stands:
    // the layout shows them the waiting screen and nothing else.
    const isApplicant = Boolean(useAuthStore.getState().user?.shopRequest);

    if (!isMerchant && !isAdminActing && !isApplicant) {
      if (roles.includes("admin")) {
        throw redirect({ to: "/admin/merchants" });
      }
      // Neither a shop nor an administrator: /admin would send them back
      // here for ever ("Too many redirects"). Out, and to the login.
      useAuthStore.getState().signOut();
      throw redirect({ to: "/login" });
    }

    if (session.rol !== "comerc") {
      useSessionStore.getState().setRol("comerc");
    }
  },
  component: ComercLayout,
});

function ComercLayout() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const requestQ = useShopRequestSession();
  const shopRequest = requestQ.data?.shopRequest;

  if (requestQ.isLoading || requestQ.isError || shopRequest) {
    return (
      <ShopRequestStatus
        state={requestQ.isLoading ? "loading" : requestQ.isError ? "error" : "ready"}
        request={shopRequest}
        supportEmail={SUPPORT_EMAIL}
        onRetry={() => requestQ.refetch()}
        onSignOut={() => {
          signOut();
          navigate({ to: "/login" });
        }}
      />
    );
  }

  return (
    <AppLayout>
      <WelcomeSlot />
      <Outlet />
    </AppLayout>
  );
}

// Section 6 (first-access welcome): separable, remove this slot to drop it.
const welcomeStepRoutes = {
  profile: "/merchant/my-profile",
  promotion: "/merchant/promotions",
  poster: "/merchant/my-qr",
} as const;

function WelcomeSlot() {
  const navigate = useNavigate();
  const welcome = useMerchantWelcome();
  const comercQ = useQuery({ queryKey: ["comerc", "me"], queryFn: () => comercService.getMe() });
  if (welcome.finished) return null;
  return (
    <div className="mb-6">
      <MerchantWelcome
        shopName={comercQ.data?.nom ?? ""}
        steps={welcome.steps}
        loading={welcome.loading}
        error={welcome.error}
        dismissed={welcome.dismissed}
        onReload={welcome.reload}
        onDismiss={welcome.dismiss}
        onReopen={welcome.reopen}
        onOpenStep={(id) => navigate({ to: welcomeStepRoutes[id] })}
      />
    </div>
  );
}
