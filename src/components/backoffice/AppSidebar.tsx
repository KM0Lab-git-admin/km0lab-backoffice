import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  QrCode,
  Tag,
  BarChart3,
  Store,
  Pencil,
  LogOut,
  LayoutDashboard,
  Zap,
  Gift,
  Ticket,
  Users,
  Settings,
  Landmark,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLang } from "@/contexts/LangContext";
import { useAuthStore } from "@/stores/useAuthStore";
import type { MessageKey } from "@/lib/i18n";
import type { Rol } from "@/types/backoffice";

type NavItem = {
  to: string;
  labelKey: MessageKey;
  icon: typeof QrCode;
};

const comercNav: NavItem[] = [
  { to: "/merchant/my-qr", labelKey: "nav.elMeuQR", icon: QrCode },
  { to: "/merchant/promotions", labelKey: "nav.promocions", icon: Tag },
  { to: "/merchant/vouchers", labelKey: "nav.vals", icon: Ticket },
  { to: "/merchant/statistics", labelKey: "nav.estadistiques", icon: BarChart3 },
  { to: "/merchant/my-profile", labelKey: "nav.laMevaFitxa", icon: Store },
];

const adminNav: NavItem[] = [
  { to: "/admin/overview", labelKey: "nav.resum", icon: LayoutDashboard },
  { to: "/admin/actions", labelKey: "nav.accions", icon: Zap },
  { to: "/admin/rewards", labelKey: "nav.recompenses", icon: Gift },
  { to: "/admin/redemptions", labelKey: "nav.bescanvis", icon: Ticket },
  { to: "/admin/merchants", labelKey: "nav.comercos", icon: Store },
  { to: "/admin/users", labelKey: "nav.usuaris", icon: Users },
  { to: "/admin/settings", labelKey: "nav.configuracio", icon: Settings },
];

export type SidebarIdentity = {
  rol: Rol;
  title: string;
  subtitleKey: MessageKey;
  emoji?: string;
  logoUrl?: string;
  editHref?: string;
};

type Props = {
  identity: SidebarIdentity;
};

export function AppSidebar({ identity }: Props) {
  const { t } = useLang();
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navItems = identity.rol === "admin" ? adminNav : comercNav;
  const roleTagKey: MessageKey =
    identity.rol === "admin" ? "role.tag.admin" : "role.tag.comerc";

  function handleSignOut() {
    signOut();
    toast.success(t("auth.signOut.toast"));
    navigate({ to: "/login" });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex flex-col gap-4 px-2 py-3">
          <span className="inline-flex w-fit items-center rounded-md bg-km0-blue-700 px-2.5 py-1 text-sm font-black tracking-wide text-km0-beige-100 group-data-[collapsible=icon]:hidden">
            {t("app.brand")}
          </span>
          <span className="hidden h-9 w-9 place-items-center rounded-md bg-km0-blue-700 text-xs font-black text-km0-beige-100 group-data-[collapsible=icon]:grid">
            KM0
          </span>
          <p className="px-1 text-[10px] font-black uppercase tracking-widest text-km0-yellow-300 group-data-[collapsible=icon]:hidden">
            {t(roleTagKey)}
          </p>
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 group-data-[collapsible=icon]:hidden">
            <div
              aria-hidden
              className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-km0-yellow-300 to-km0-yellow-400 text-lg text-km0-blue-800"
            >
              {identity.logoUrl ? (
                <img
                  src={identity.logoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : identity.emoji ? (
                <span>{identity.emoji}</span>
              ) : (
                <Landmark className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight">{identity.title}</p>
              <p className="truncate text-xs text-white/70">{t(identity.subtitleKey)}</p>
            </div>
            {identity.editHref ? (
              <Link
                to={identity.editHref}
                aria-label={t("app.editMerchant")}
                title={t("app.editMerchant")}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-km0-beige-100 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km0-yellow-300"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={t(item.labelKey)}>
                      <Link to={item.to} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{t(item.labelKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip={t("auth.signOut")}>
              <LogOut className="h-4 w-4 shrink-0" />
              <span>{t("auth.signOut")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
