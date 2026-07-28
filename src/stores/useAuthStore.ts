import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  email: string;
  nomComerc: string;
  telefon: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        email: "demo@km0lab.cat",
        nomComerc: "Forn Rovira",
        telefon: "+34 900 000 000",
      },
      isAuthenticated: true,
      signIn: (user) => set({ user, isAuthenticated: true }),
      signOut: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "km0lab.backoffice.auth.v2-demo" },
  ),
);
