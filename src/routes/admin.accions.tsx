import { createFileRoute } from "@tanstack/react-router";
import AccionsPage from "@/pages/Accions";

export const Route = createFileRoute("/admin/accions")({
  head: () => ({
    meta: [
      { title: "Accions de punts · KM0 LAB" },
      {
        name: "description",
        content:
          "Configura les accions per les quals els veïns guanyen punts al programa KM0 LAB.",
      },
    ],
  }),
  component: AccionsPage,
});
