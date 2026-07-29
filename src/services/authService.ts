import { api } from "@/lib/apiClient";
import type { AuthUser } from "@/stores/useAuthStore";
import type { ApiAuthOut, ApiUser } from "@/types/api";

/** Demo OTP accepted by km0lab-api in development/staging. */
export const MOCK_OTP_CODE = "123456";

/**
 * One-click demo login on /login (skips OTP for admin/merchant).
 * Only enabled in local Vite (`import.meta.env.DEV`). Production/UAT builds require real OTP.
 */
export const DEV_SKIP_OTP = import.meta.env.DEV;

export const DEMO_ADMIN_EMAIL = "admin@km0lab.com";
export const DEMO_MERCHANT_EMAIL = "merchant@km0lab.com";

const DEMO_EMAILS = new Set([
  "resident@km0lab.com",
  DEMO_MERCHANT_EMAIL,
  DEMO_ADMIN_EMAIL,
]);

export function isDemoEmail(email: string): boolean {
  return DEMO_EMAILS.has(email.trim().toLowerCase());
}

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
    // Demo accounts use fixed OTP — no need to hit the rate-limited endpoint.
    if (isDemoEmail(email)) return { ok: true };
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

  /** Direct verify with fixed demo OTP (no request-otp / no UI code step). */
  async loginAsDemo(kind: "admin" | "merchant"): Promise<AuthSession> {
    const email = kind === "admin" ? DEMO_ADMIN_EMAIL : DEMO_MERCHANT_EMAIL;
    return authService.verifyLoginCode(email, MOCK_OTP_CODE);
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
