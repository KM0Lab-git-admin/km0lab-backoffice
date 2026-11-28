import { api } from "@/lib/apiClient";
import {
  adminMeFromUser,
  adminStatsFromApi,
  accioTopFromApi,
  bescanviResumFromApi,
} from "@/lib/mappers/admin";
import type {
  AccioTop,
  AdminMe,
  AdminResumStats,
  BescanviResum,
  SignupsByProvider,
} from "@/types/backoffice";
import type {
  ApiAdminStats,
  ApiPointAction,
  ApiRedemption,
  ApiResident,
  ApiReward,
  ApiTown,
  ApiUser,
} from "@/types/api";

export const adminService = {
  async getMe(): Promise<AdminMe> {
    const [user, town] = await Promise.all([
      api.get<ApiUser>("/users/me"),
      api.get<ApiTown>("/towns/me").catch(() => null),
    ]);
    return adminMeFromUser(user, town);
  },

  async getResumStats(): Promise<AdminResumStats> {
    const stats = await api.get<ApiAdminStats>("/stats/admin");
    return adminStatsFromApi(stats);
  },

  /** How the residents of this municipality came in, by door. */
  async getSignupsByProvider(): Promise<SignupsByProvider> {
    const stats = await api.get<ApiAdminStats>("/stats/admin");
    return adminStatsFromApi(stats).signupsByProvider;
  },

  async getAccionsTop(): Promise<AccioTop[]> {
    const actions = await api.get<ApiPointAction[]>("/actions");
    return actions
      .filter((a) => a.active)
      .slice(0, 5)
      .map(accioTopFromApi);
  },

  async getUltimsBescanvis(): Promise<BescanviResum[]> {
    const [redemptions, residents, rewards] = await Promise.all([
      api.get<ApiRedemption[]>("/redemptions"),
      api.get<ApiResident[]>("/residents").catch(() => [] as ApiResident[]),
      api.get<ApiReward[]>("/rewards").catch(() => [] as ApiReward[]),
    ]);
    const residentsById = new Map(residents.map((r) => [r.id, r]));
    const rewardsById = new Map(rewards.map((r) => [r.id, r]));
    return redemptions.slice(0, 8).map((r) => {
      const user = residentsById.get(r.user_id);
      const reward = rewardsById.get(r.reward_id);
      return bescanviResumFromApi(r, {
        usuariNom:
          user?.name ??
          ([user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
            undefined),
        recompensaNom: reward?.name,
      });
    });
  },
};
