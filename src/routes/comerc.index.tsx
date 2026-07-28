import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/comerc/")({
  beforeLoad: () => {
    throw redirect({ to: "/comerc/el-meu-qr" });
  },
});
