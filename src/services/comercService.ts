import { comercMeFixture } from "@/data/fixtures/promocions";
import type { ComercMe } from "@/types/comerc";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const comercService = {
  async getMe(): Promise<ComercMe> {
    await delay(300);
    return comercMeFixture;
  },
};
