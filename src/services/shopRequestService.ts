// A shop asks to join: the sign-up form and what the applicant sees after.
//
// Production (locked). The screens come from the prototype and call these
// same functions through `services/mock/shopRequestService`, which here only
// re-exports this file.
//
// The request is sent with the session of whoever asks: the code they got by
// email is what proves the contact email is theirs. The shop then waits for
// the administrator of its municipality (km0lab-api `shop_review.py`).
import { api, ApiError } from "@/lib/apiClient";
import { categoriesToApi } from "@/lib/mappers/categories";
import { isValidTaxId as checkTaxId, normalizeTaxId } from "@/lib/taxId";
import { mapUser } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ApiAuthOut, ApiUser } from "@/types/api";
import type {
  SessionShopRequest,
  ShopRequestErrorCode,
  ShopRequestInput,
  ShopRequestResult,
} from "@/types/shopRequest";

export function isValidTaxId(value: string): boolean {
  return checkTaxId(value);
}

// The session of whoever is filling the form, between the code and the
// request. Kept here, not in the store: they are not in the panel yet.
let applicant: { email: string; token: string } | null = null;

export async function requestShopRequestCode(email: string, lang?: string): Promise<{ ok: true }> {
  await api.post("/auth/request-otp", { email: email.trim(), lang }, { auth: false });
  return { ok: true };
}

/** True if the code was right. Anything else (wrong, expired, no network) is false. */
export async function verifyShopRequestCode(
  email: string,
  code: string,
  termsVersion?: string,
): Promise<boolean> {
  try {
    const out = await api.post<ApiAuthOut>(
      "/auth/verify-otp",
      { email: email.trim(), code, terms_version: termsVersion },
      { auth: false },
    );
    applicant = { email: out.user.email.toLowerCase(), token: out.access_token };
    return true;
  } catch {
    return false;
  }
}

/** What the API answered -> the field the form has to mark. */
export function shopRequestErrorFromApi(e: unknown): ShopRequestErrorCode {
  if (!(e instanceof ApiError)) return "generic";
  const raw = (e.detail as { detail?: unknown } | undefined)?.detail;
  const detail = typeof raw === "string" ? raw : "";
  if (detail === "tax_id_invalid") return "tax_id_invalid";
  if (detail === "tax_id_already_registered") return "tax_id_taken";
  if (detail === "postal_code_not_allowed") return "postal_code_not_allowed";
  if (detail === "Unknown postal code") return "postal_code_unknown";
  // One request or shop per email; an account that already runs a shop or
  // administers a municipality cannot ask for another either.
  if (
    detail === "Shop already registered for this email" ||
    detail === "Merchant already has a shop" ||
    detail === "Admin cannot also be merchant"
  ) {
    return "email_taken";
  }
  return "generic";
}

export async function submitShopRequest(input: ShopRequestInput): Promise<ShopRequestResult> {
  const email = input.email.trim().toLowerCase();
  if (!applicant || applicant.email !== email) {
    // The code step was skipped or was for another email: nothing to send with.
    return { ok: false, error: "generic" };
  }
  try {
    // Proof of consent: the form does not let anyone get here without
    // ticking the box. Same record the residents' App leaves.
    await api
      .patch("/users/me", { terms_version: input.termsVersion }, { token: applicant.token })
      .catch(() => undefined);
    await api.post(
      "/shops/public-signup",
      {
        name: input.name.trim(),
        tax_id: normalizeTaxId(input.taxId),
        categories: input.category ? categoriesToApi([input.category]) : [],
        contact_email: email,
        postal_code: input.postalCode.trim(),
        address: input.address.trim() || null,
        phone: input.phone.trim() || null,
        invite_code: input.inviteCode?.trim() || null,
      },
      { token: applicant.token },
    );
    applicant = null;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: shopRequestErrorFromApi(e) };
  }
}

export function sessionShopRequestFromUser(
  user: Pick<ApiUser, "shop_request">,
): SessionShopRequest {
  const request = user.shop_request;
  if (!request) return null;
  return {
    name: request.name,
    status: request.status === "rejected" ? "rejected" : "review",
    rejectionReason: request.reason ?? null,
  };
}

/**
 * The request of whoever is signed in, as the server has it now. It also
 * refreshes what the panel knows about the account: the day the request is
 * approved the same session becomes a shop's, without signing in again.
 */
export async function getSessionShopRequest(): Promise<{ shopRequest: SessionShopRequest }> {
  const me = await api.get<ApiUser>("/users/me");
  const store = useAuthStore.getState();
  if (store.token && store.user?.id === me.id) {
    store.signIn({ token: store.token, user: mapUser(me, store.user) });
  }
  return { shopRequest: sessionShopRequestFromUser(me) };
}
