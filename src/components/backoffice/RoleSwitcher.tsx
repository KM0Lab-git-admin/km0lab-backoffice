import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/stores/useSessionStore";
import { useLang } from "@/contexts/LangContext";

/**
 * Displays the active role from the JWT-backed session.
 * Role is no longer switchable in the UI — login with admin@ / merchant@ instead.
 */
export function RoleSwitcher() {
  const { t } = useLang();
  const rol = useSessionStore((s) => s.rol);

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      aria-label={t("role.switcher.aria")}
      disabled
      title={t("role.switcher.hint")}
    >
      <UserCog className="h-4 w-4" />
      <span className="hidden sm:inline">
        {rol === "admin" ? t("role.tag.admin") : t("role.tag.comerc")}
      </span>
    </Button>
  );
}
