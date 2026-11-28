// Shop sign-up requests (alta de comerços) and their admin review.

export type ShopRequestErrorCode =
  | "tax_id_invalid"
  | "postal_code_unknown"
  | "postal_code_not_allowed"
  | "email_taken"
  | "tax_id_taken"
  | "generic";

export type ShopRequestInput = {
  name: string;
  taxId: string;
  postalCode: string;
  address: string;
  phone: string;
  category?: string;
  email: string;
  termsVersion: string;
  inviteCode?: string;
};

export type ShopRequestResult = { ok: true } | { ok: false; error: ShopRequestErrorCode };

export type SessionShopRequest = {
  name: string;
  status: "review" | "rejected";
  rejectionReason?: string | null;
  expectedDays?: number;
} | null;

export type ShopReviewStatus = "pending" | "approved" | "rejected";

export type ShopReview = {
  status: ShopReviewStatus;
  taxIdValid: boolean;
  postalCodeInTown: boolean;
  emailVerified: boolean;
  sameTaxId: string[];
  similarNames: string[];
  invitedBy: string | null;
  invitePoints: number;
};

export type ShopDecisionErrorCode = "already_decided" | "generic";

export type PilotLimit = {
  maxResidents: number | null;
  residentsCount: number;
};

export type WelcomeStepId = "profile" | "promotion" | "poster";

export type WelcomeStep = { id: WelcomeStepId; done: boolean };
