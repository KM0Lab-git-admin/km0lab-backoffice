// The administrator reviews the shops that asked to join.
//
// Production (locked). The screens call these same functions through
// `services/mock/shopReviewService`, which here only re-exports this file.
import { api, ApiError } from "@/lib/apiClient";
import { comercAdminFromShop } from "@/lib/mappers/admin";
import type { ApiShop, ApiShopReview } from "@/types/api";
import type { ComercAdmin } from "@/types/backoffice";
import type { ShopReview, ShopReviewStatus } from "@/types/shopRequest";

export class ShopDecisionError extends Error {
  constructor(public code: "already_decided" | "generic") {
    super(code);
  }
}

const STATUS: Record<string, ShopReviewStatus> = {
  review: "pending",
  rejected: "rejected",
};

export function shopReviewFromApi(r: ApiShopReview): ShopReview {
  return {
    // Anything that is no longer waiting or rejected has been approved.
    status: STATUS[r.status] ?? "approved",
    taxIdValid: r.tax_id_valid,
    postalCodeInTown: r.postal_code_in_town,
    emailVerified: r.email_verified,
    sameTaxId: r.same_tax_id ?? [],
    similarNames: r.similar_names ?? [],
    invitedBy: r.invited_by ?? null,
    invitePoints: r.invite_points ?? 0,
  };
}

export async function listPendingShopRequests(): Promise<ComercAdmin[]> {
  const shops = await api.get<ApiShop[]>("/shops?status=review");
  return shops.map((s) => comercAdminFromShop(s));
}

export async function getShopReview(id: string): Promise<ShopReview> {
  return shopReviewFromApi(await api.get<ApiShopReview>(`/shops/${id}/review`));
}

// 409: somebody else decided it first (or it was never waiting).
function decisionError(e: unknown): ShopDecisionError {
  return new ShopDecisionError(
    e instanceof ApiError && e.status === 409 ? "already_decided" : "generic",
  );
}

export async function approveShop(id: string): Promise<void> {
  try {
    await api.post(`/shops/${id}/approve`);
  } catch (e) {
    throw decisionError(e);
  }
}

export async function rejectShop(id: string, reason: string): Promise<void> {
  try {
    await api.post(`/shops/${id}/reject`, { reason: reason.trim() });
  } catch (e) {
    throw decisionError(e);
  }
}
