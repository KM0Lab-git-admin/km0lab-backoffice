import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Rol } from "@/types/backoffice";

type SessionState = {
  rol: Rol;
  poblacioId: string;
  comercId?: string;
  actingAsShopId?: string;
  actingAsShopName?: string;
  setRol: (rol: Rol) => void;
  setSession: (session: {
    rol: Rol;
    poblacioId: string;
    comercId?: string;
    actingAsShopId?: string;
    actingAsShopName?: string;
  }) => void;
  enterActingAsShop: (shop: { id: string; nom: string }) => void;
  exitActingAsShop: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      rol: "comerc",
      poblacioId: "",
      comercId: undefined,
      actingAsShopId: undefined,
      actingAsShopName: undefined,
      setRol: (rol) => set({ rol }),
      setSession: (session) => set(session),
      enterActingAsShop: (shop) =>
        set({
          actingAsShopId: shop.id,
          actingAsShopName: shop.nom,
          comercId: shop.id,
          rol: "comerc",
        }),
      exitActingAsShop: () => {
        const { poblacioId } = get();
        set({
          actingAsShopId: undefined,
          actingAsShopName: undefined,
          comercId: undefined,
          rol: "admin",
          poblacioId,
        });
      },
    }),
    { name: "km0lab.backoffice.session.v2" },
  ),
);
