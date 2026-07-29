import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, type SidebarIdentity } from "@/components/backoffice/AppSidebar";
import { LangSwitcher } from "@/components/backoffice/LangSwitcher";
import { RoleSwitcher } from "@/components/backoffice/RoleSwitcher";
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
  const rol = useSessionStore((s) => s.rol);

  const comercQuery = useQuery({
    queryKey: ["comerc", "me"],
    queryFn: () => comercService.getMe(),
    enabled: rol === "comerc",
  });

  const adminQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminService.getMe(),
    enabled: rol === "admin",
  });

  let identity: SidebarIdentity | null = null;
  let headerTitle = "";

  if (rol === "comerc" && comercQuery.data) {
    identity = {
      rol: "comerc",
      title: comercQuery.data.nom,
      subtitleKey: "app.merchantSubtitle",
      emoji: comercQuery.data.emoji ?? "🏪",
      editHref: "/merchant/my-profile",
    };
    headerTitle = comercQuery.data.nom;
  } else if (rol === "admin" && adminQuery.data) {
    identity = {
      rol: "admin",
      title: adminQuery.data.poblacioNom,
      subtitleKey: "app.adminSubtitle",
      emoji: "🏛️",
    };
    headerTitle = adminQuery.data.poblacioNom;
  }

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
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
            <SidebarTrigger aria-label={t("nav.openMenu")} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-muted-foreground md:hidden">
                {headerTitle}
              </p>
            </div>
            <RoleSwitcher />
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
