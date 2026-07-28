import { api } from "@/lib/apiClient";
import { rolFromRoles } from "@/lib/roles";
import type { AuthUser } from "@/stores/useAuthStore";
import type { ApiAuthOut, ApiUser } from "@/types/api";

/** Demo OTP accepted by km0lab-api in development/staging. */
export const MOCK_OTP_CODE = "123456";

export type RegisterInput = {
  nomComerc: string;
  personaContacte: string;
  email: string;
  telefon: string;
};

export type AuthenticatedUser = AuthUser;

export type AuthSession = {
  token: string;
  user: AuthUser;
};

function mapUser(apiUser: ApiUser, fallback?: Partial<AuthUser>): AuthUser {
  const display =
    apiUser.name?.trim() ||
    [apiUser.first_name, apiUser.last_name].filter(Boolean).join(" ").trim() ||
    fallback?.nomComerc ||
    apiUser.email;
  return {
    id: apiUser.id,
    email: apiUser.email,
    nomComerc: display,
    telefon: apiUser.phone ?? fallback?.telefon ?? "",
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    roles: apiUser.roles,
    townId: apiUser.town_id,
    townName: apiUser.town_name,
    shopId: apiUser.shop_id,
  };
}

function mapAuth(out: ApiAuthOut, fallback?: Partial<AuthUser>): AuthSession {
  return {
    token: out.access_token,
    user: mapUser(out.user, fallback),
  };
}

let pendingRegister: RegisterInput | null = null;

export const authService = {
  async requestLoginCode(email: string): Promise<{ ok: true }> {
    await api.post("/auth/request-otp", { email }, { auth: false });
    return { ok: true };
  },

  async verifyLoginCode(email: string, code: string): Promise<AuthSession> {
    const out = await api.post<ApiAuthOut>(
      "/auth/verify-otp",
      { email, code },
      { auth: false },
    );
    return mapAuth(out);
  },

  async requestRegistration(input: RegisterInput): Promise<{ ok: true }> {
    pendingRegister = input;
    await api.post("/auth/request-otp", { email: input.email }, { auth: false });
    return { ok: true };
  },

  async verifyRegistration(email: string, code: string): Promise<AuthSession> {
    if (!pendingRegister || pendingRegister.email !== email) {
      throw new Error("no_pending_registration");
    }
    const fallback = {
      nomComerc: pendingRegister.nomComerc,
      telefon: pendingRegister.telefon,
    };
    const out = await api.post<ApiAuthOut>(
      "/auth/verify-otp",
      { email, code },
      { auth: false },
    );
    pendingRegister = null;
    return mapAuth(out, fallback);
  },
};

export { rolFromRoles };
