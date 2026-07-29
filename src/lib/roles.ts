import type { Rol } from "@/types/backoffice";

export function rolFromRoles(roles: string[]): Rol {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("merchant")) return "comerc";
  return "comerc";
}

export function homePathForRol(rol: Rol): "/admin/overview" | "/merchant/my-qr" {
  return rol === "admin" ? "/admin/overview" : "/merchant/my-qr";
}
