import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Rol } from "@/types/backoffice";

type SessionState = {
  rol: Rol;
  poblacioId: string;
  comercId?: string;
  setRol: (rol: Rol) => void;
  setSession: (session: {
    rol: Rol;
    poblacioId: string;
    comercId?: string;
  }) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      rol: "comerc",
      poblacioId: "",
      comercId: undefined,
      setRol: (rol) => set({ rol }),
      setSession: (session) => set(session),
    }),
    { name: "km0lab.backoffice.session.v2" },
  ),
);
