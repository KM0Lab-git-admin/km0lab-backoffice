import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  email: string;
  nomComerc: string;
  telefon: string;
  firstName?: string | null;
  lastName?: string | null;
  roles: string[];
  townId?: string | null;
  /** Població a la qual està lligat el compte (la del comerç, per a un comerç). */
  townName?: string | null;
  /** Municipi (àmbit gestionat). El que es mostra a un administrador. */
  municipalityName?: string | null;
  shopId?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (payload: { user: AuthUser; token: string }) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      signIn: ({ user, token }) =>
        set({ user, token, isAuthenticated: true }),
      signOut: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "km0lab.backoffice.auth.v3" },
  ),
);
