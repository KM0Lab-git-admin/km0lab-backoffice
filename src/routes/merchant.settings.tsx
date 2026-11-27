import { createFileRoute } from "@tanstack/react-router";
import Placeholder from "@/pages/Placeholder";

export const Route = createFileRoute("/merchant/settings")({
  component: () => <Placeholder title="Configuració" />,
});
