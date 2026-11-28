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
export const MALGRAT_ADMIN_EMAIL = "admin-malgrat@km0lab.com";
export const MALGRAT_MERCHANT1_EMAIL = "merchant1-malgrat@km0lab.com";
export const MALGRAT_MERCHANT2_EMAIL = "merchant2-malgrat@km0lab.com";

const FIXED_OTP_EMAILS = new Set([
  "resident@km0lab.com",
  DEMO_MERCHANT_EMAIL,
  DEMO_ADMIN_EMAIL,
  MALGRAT_ADMIN_EMAIL,
  MALGRAT_MERCHANT1_EMAIL,
  MALGRAT_MERCHANT2_EMAIL,
]);

export function isDemoEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return (
    normalized === "resident@km0lab.com" ||
    normalized === DEMO_MERCHANT_EMAIL ||
    normalized === DEMO_ADMIN_EMAIL
  );
}

export function isFixedOtpEmail(email: string): boolean {
  return FIXED_OTP_EMAILS.has(email.trim().toLowerCase());
}

/**
 * The backoffice is for administrators and shops; a resident has no page in
 * it. One exception: whoever asked to register a shop gets in to see where
 * the request stands, and nothing else.
 */
export function canUseBackoffice(roles: string[], hasShopRequest = false): boolean {
  return roles.includes("admin") || roles.includes("merchant") || hasShopRequest;
}

export type AuthenticatedUser = AuthUser;

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export function mapUser(apiUser: ApiUser, fallback?: Partial<AuthUser>): AuthUser {
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
    municipalityName: apiUser.municipality_name ?? apiUser.town_name,
    shopId: apiUser.shop_id,
    shopRequest: apiUser.shop_request
      ? {
          name: apiUser.shop_request.name,
          status: apiUser.shop_request.status === "rejected" ? "rejected" : "review",
          rejectionReason: apiUser.shop_request.reason ?? null,
        }
      : null,
  };
}

function mapAuth(out: ApiAuthOut, fallback?: Partial<AuthUser>): AuthSession {
  return {
    token: out.access_token,
    user: mapUser(out.user, fallback),
  };
}

export const authService = {
  async requestLoginCode(email: string, lang?: string): Promise<{ ok: true }> {
    // Demo accounts use fixed OTP — no need to hit the rate-limited endpoint.
    if (isFixedOtpEmail(email)) return { ok: true };
    // `lang`: the email with the code comes in the language of the screen.
    await api.post("/auth/request-otp", { email, lang }, { auth: false });
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

  async loginAsMalgrat(
    kind: "admin" | "merchant1" | "merchant2",
  ): Promise<AuthSession> {
    const email =
      kind === "admin"
        ? MALGRAT_ADMIN_EMAIL
        : kind === "merchant1"
          ? MALGRAT_MERCHANT1_EMAIL
          : MALGRAT_MERCHANT2_EMAIL;
    return authService.verifyLoginCode(email, MOCK_OTP_CODE);
  },
};
