import { createFileRoute } from "@tanstack/react-router";
import Placeholder from "@/pages/Placeholder";

export const Route = createFileRoute("/comerc/configuracio")({
  component: () => <Placeholder title="Configuració" />,
});
