import { createFileRoute } from "@tanstack/react-router";
import RecompensesPage from "@/pages/Recompenses";

export const Route = createFileRoute("/admin/rewards")({
  head: () => ({
    meta: [
      { title: "Recompenses · KM0 LAB" },
      {
        name: "description",
        content:
          "Catàleg de recompenses que els veïns poden bescanviar pels seus punts al programa KM0 LAB.",
      },
    ],
  }),
  component: RecompensesPage,
});
