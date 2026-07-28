import { create } from "zustand";
import type { PoblacioConfig } from "@/types/backoffice";
import { poblacioConfigFixture } from "@/data/fixtures/configuracio";

type State = {
  configs: Record<string, PoblacioConfig>;
  upsert: (c: PoblacioConfig) => void;
};

export const useAdminConfigStore = create<State>((set) => ({
  configs: { [poblacioConfigFixture.poblacioId]: poblacioConfigFixture },
  upsert: (c) =>
    set((state) => ({ configs: { ...state.configs, [c.poblacioId]: c } })),
}));
