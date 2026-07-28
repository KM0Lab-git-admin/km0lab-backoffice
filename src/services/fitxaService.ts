import { comercFitxaFixture } from "@/data/fixtures/promocions";
import type { ComercFitxa, ComercFitxaInput } from "@/types/comerc";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// In-memory mock store so updates persist during the session.
let current: ComercFitxa = { ...comercFitxaFixture };

export const fitxaService = {
  async getFitxa(): Promise<ComercFitxa> {
    await delay(250);
    return { ...current };
  },
  async updateFitxa(input: ComercFitxaInput): Promise<ComercFitxa> {
    await delay(400);
    current = { id: current.id, ...input };
    return { ...current };
  },
};
