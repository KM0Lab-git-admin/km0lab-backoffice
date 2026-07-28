import { useNavigate } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/stores/useSessionStore";
import { useLang } from "@/contexts/LangContext";
import type { Rol } from "@/types/backoffice";

export function RoleSwitcher() {
  const { t } = useLang();
  const rol = useSessionStore((s) => s.rol);
  const setRol = useSessionStore((s) => s.setRol);
  const navigate = useNavigate();

  function onChange(value: string) {
    const next = value as Rol;
    if (next === rol) return;
    setRol(next);
    if (next === "admin") navigate({ to: "/admin/resum" });
    else navigate({ to: "/comerc/el-meu-qr" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label={t("role.switcher.aria")}
        >
          <UserCog className="h-4 w-4" />
          <span className="hidden sm:inline">
            {rol === "admin" ? t("role.tag.admin") : t("role.tag.comerc")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("role.switcher.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={rol} onValueChange={onChange}>
          <DropdownMenuRadioItem value="comerc">
            {t("role.switcher.comerc")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="admin">
            {t("role.switcher.admin")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          {t("role.switcher.hint")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
