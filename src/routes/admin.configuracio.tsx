import { createFileRoute } from "@tanstack/react-router";
import Configuracio from "@/pages/Configuracio";

export const Route = createFileRoute("/admin/configuracio")({
  component: Configuracio,
});
