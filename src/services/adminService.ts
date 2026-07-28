import {
  accionsTopFixture,
  adminMeFixture,
  adminResumStatsFixture,
  ultimsBescanvisFixture,
} from "@/data/fixtures/admin";
import type {
  AccioTop,
  AdminMe,
  AdminResumStats,
  BescanviResum,
} from "@/types/backoffice";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const adminService = {
  async getMe(): Promise<AdminMe> {
    await delay(300);
    return adminMeFixture;
  },
  async getResumStats(): Promise<AdminResumStats> {
    await delay(400);
    return adminResumStatsFixture;
  },
  async getAccionsTop(): Promise<AccioTop[]> {
    await delay(400);
    return accionsTopFixture;
  },
  async getUltimsBescanvis(): Promise<BescanviResum[]> {
    await delay(400);
    return ultimsBescanvisFixture;
  },
};
