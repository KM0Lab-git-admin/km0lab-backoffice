import { BadgePercent, Package, Shirt, Sparkles, Wallet, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RecompensaTipus } from "@/types/backoffice";
import { cn } from "@/lib/utils";

const ICONS: Record<RecompensaTipus, LucideIcon> = {
  saldo: Wallet,
  descompte: BadgePercent,
  marxandatge: Shirt,
  experiencia: Sparkles,
  producte: Package,
  servei: Wrench,
};

export function RecompensaTipusIcon({
  tipus,
  className,
}: {
  tipus: RecompensaTipus;
  className?: string;
}) {
  const Icon = ICONS[tipus];
  return <Icon className={cn("h-10 w-10", className)} aria-hidden />;
}
