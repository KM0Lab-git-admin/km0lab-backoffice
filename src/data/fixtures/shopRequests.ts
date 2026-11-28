import type { ShopReview } from "@/types/shopRequest";

// Review details per shop request id (matches ids in comercosFixture).
export const shopReviewsFixture: Record<string, ShopReview> = {
  "sol-forn-rovira-fills": {
    status: "pending",
    taxIdValid: true,
    postalCodeInTown: true,
    emailVerified: true,
    sameTaxId: ["Forn Rovira"],
    similarNames: ["Forn Rovira"],
    invitedBy: null,
    invitePoints: 0,
  },
  "sol-herbolari-montseny": {
    status: "pending",
    taxIdValid: true,
    postalCodeInTown: true,
    emailVerified: true,
    sameTaxId: [],
    similarNames: [],
    invitedBy: null,
    invitePoints: 0,
  },
  "sol-bicis-riells": {
    status: "pending",
    taxIdValid: true,
    postalCodeInTown: true,
    emailVerified: true,
    sameTaxId: [],
    similarNames: [],
    invitedBy: "Laia R.",
    invitePoints: 200,
  },
  "sol-ceramiques-breda": {
    status: "approved",
    taxIdValid: true,
    postalCodeInTown: true,
    emailVerified: true,
    sameTaxId: [],
    similarNames: [],
    invitedBy: null,
    invitePoints: 0,
  },
  "sol-outlet-online": {
    status: "rejected",
    taxIdValid: true,
    postalCodeInTown: false,
    emailVerified: true,
    sameTaxId: [],
    similarNames: [],
    invitedBy: null,
    invitePoints: 0,
  },
};

export const rejectionReasonsFixture: Record<string, string> = {
  "sol-outlet-online": "No té botiga física al municipi: només ven per internet.",
};

export const pilotLimitFixture = { maxResidents: 100, residentsCount: 38 };
