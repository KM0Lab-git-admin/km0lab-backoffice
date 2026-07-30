import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, type SidebarIdentity } from "@/components/backoffice/AppSidebar";
import { LangSwitcher } from "@/components/backoffice/LangSwitcher";
import { RoleSwitcher } from "@/components/backoffice/RoleSwitcher";
import { Button } from "@/components/ui/button";
import { comercService } from "@/services/comercService";
import { adminService } from "@/services/adminService";
import { useLang } from "@/contexts/LangContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionStore } from "@/stores/useSessionStore";

type Props = {
  children: ReactNode;
};

export function AppLayout({ children }: Props) {
  const { t } = useLang();
  const navigate = useNavigate();
  const rol = useSessionStore((s) => s.rol);
  const actingAsShopId = useSessionStore((s) => s.actingAsShopId);
  const actingAsShopName = useSessionStore((s) => s.actingAsShopName);
  const exitActingAsShop = useSessionStore((s) => s.exitActingAsShop);

  const comercQuery = useQuery({
    queryKey: ["comerc", "me", actingAsShopId],
    queryFn: () => comercService.getMe(),
    enabled: rol === "comerc",
  });

  const adminQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminService.getMe(),
    enabled: rol === "admin" && !actingAsShopId,
  });

  let identity: SidebarIdentity | null = null;
  let headerTitle = "";

  if (rol === "comerc" && comercQuery.data) {
    identity = {
      rol: "comerc",
      title: comercQuery.data.nom,
      subtitleKey: "app.merchantSubtitle",
      emoji: comercQuery.data.emoji ?? "🏪",
      logoUrl: comercQuery.data.logoUrl,
      editHref: "/merchant/my-profile",
    };
    headerTitle = comercQuery.data.nom;
  } else if (rol === "admin" && adminQuery.data) {
    identity = {
      rol: "admin",
      title: adminQuery.data.poblacioNom,
      subtitleKey: "app.adminSubtitle",
      emoji: "🏛️",
      logoUrl: adminQuery.data.logoUrl,
    };
    headerTitle = adminQuery.data.poblacioNom;
  }

  const handleExitActing = () => {
    exitActingAsShop();
    void navigate({ to: "/admin/merchants" });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {identity ? (
          <AppSidebar identity={identity} />
        ) : (
          <aside className="hidden w-64 shrink-0 border-r p-4 md:block">
            <Skeleton className="h-9 w-40" />
          </aside>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {actingAsShopId ? (
            <div className="flex items-center justify-between gap-3 bg-km0-blue-800 px-4 py-2 text-sm text-white">
              <p className="min-w-0 truncate font-medium">
                {t("acting.banner").replace(
                  "{name}",
                  actingAsShopName || headerTitle || "…",
                )}
              </p>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleExitActing}
              >
                {t("acting.exit")}
              </Button>
            </div>
          ) : null}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
            <SidebarTrigger aria-label={t("nav.openMenu")} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-muted-foreground md:hidden">
                {headerTitle}
              </p>
            </div>
            {import.meta.env.DEV && !actingAsShopId ? <RoleSwitcher /> : null}
            <LangSwitcher />
          </header>

          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
