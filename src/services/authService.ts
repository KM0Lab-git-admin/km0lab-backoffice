// Mock authentication service for the merchant backoffice prototype.
// Stable signatures — production will implement without touching UI.
// Mock OTP code accepted: 123456.

export const MOCK_OTP_CODE = "123456";

export type RegisterInput = {
  nomComerc: string;
  personaContacte: string;
  email: string;
  telefon: string;
};

export type AuthenticatedUser = {
  email: string;
  nomComerc: string;
  telefon: string;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let pendingLogin: { email: string } | null = null;
let pendingRegister: RegisterInput | null = null;

export const authService = {
  async requestLoginCode(email: string): Promise<{ ok: true }> {
    await delay(500);
    pendingLogin = { email };
    return { ok: true };
  },

  async verifyLoginCode(email: string, code: string): Promise<AuthenticatedUser> {
    await delay(500);
    if (!pendingLogin || pendingLogin.email !== email) {
      throw new Error("no_pending_login");
    }
    if (code !== MOCK_OTP_CODE) {
      throw new Error("invalid_code");
    }
    pendingLogin = null;
    return {
      email,
      nomComerc: "Forn Rovira",
      telefon: "+34 900 000 000",
    };
  },

  async requestRegistration(input: RegisterInput): Promise<{ ok: true }> {
    await delay(600);
    pendingRegister = input;
    return { ok: true };
  },

  async verifyRegistration(email: string, code: string): Promise<AuthenticatedUser> {
    await delay(600);
    if (!pendingRegister || pendingRegister.email !== email) {
      throw new Error("no_pending_registration");
    }
    if (code !== MOCK_OTP_CODE) {
      throw new Error("invalid_code");
    }
    const data = pendingRegister;
    pendingRegister = null;
    return {
      email: data.email,
      nomComerc: data.nomComerc,
      telefon: data.telefon,
    };
  },
};
