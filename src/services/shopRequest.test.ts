import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/apiClient";
import { canUseBackoffice } from "@/services/authService";
import { getPilotLimit, savePilotLimit } from "@/services/pilotLimitService";
import {
  getSessionShopRequest,
  sessionShopRequestFromUser,
  shopRequestErrorFromApi,
  submitShopRequest,
  verifyShopRequestCode,
} from "@/services/shopRequestService";
import {
  approveShop,
  getShopReview,
  listPendingShopRequests,
  rejectShop,
  ShopDecisionError,
} from "@/services/shopReviewService";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiUser, fakeApi } from "@/test/fakeApi";

afterEach(() => {
  vi.unstubAllGlobals();
  useAuthStore.getState().signOut();
});

const request = {
  name: "Forn de la Plaça",
  taxId: "b-12.345.674",
  postalCode: "08380",
  address: "Carrer Major, 1",
  phone: "937000000",
  category: "Fleca",
  email: "Forn@Example.com",
  termsVersion: "2",
};

const apiError = (status: number, detail: unknown) => new ApiError(status, "x", { detail });

describe("el comercio pide el alta", () => {
  it("con la sesión del código, manda los datos tal como los quiere la API", async () => {
    const { calls } = fakeApi({
      "POST /auth/verify-otp": { json: { access_token: "jwt-forn", user: apiUser() } },
      "PATCH /users/me": { json: apiUser({ terms_version: "2" }) },
      "POST /shops/public-signup": { json: { shop_id: "s1", status: "review" } },
    });

    expect(await verifyShopRequestCode("forn@example.com", "123456", "2")).toBe(true);
    expect(await submitShopRequest(request)).toEqual({ ok: true });

    const [, consent, signup] = calls;
    // Proof of consent, with the version in force, before the request.
    expect(consent).toMatchObject({ method: "PATCH", body: { terms_version: "2" } });
    expect(signup.auth).toBe("Bearer jwt-forn");
    expect(signup.body).toEqual({
      name: "Forn de la Plaça",
      tax_id: "B12345674",
      categories: ["bakery"],
      contact_email: "forn@example.com",
      postal_code: "08380",
      address: "Carrer Major, 1",
      phone: "937000000",
      invite_code: null,
    });
  });

  it("sin haber confirmado ese correo, no manda nada", async () => {
    const { calls } = fakeApi({
      "POST /auth/verify-otp": {
        json: { access_token: "jwt", user: apiUser({ email: "altre@example.com" }) },
      },
    });
    await verifyShopRequestCode("altre@example.com", "123456");
    expect(await submitShopRequest(request)).toEqual({ ok: false, error: "generic" });
    expect(calls.map((c) => c.path)).toEqual(["/auth/verify-otp"]);
  });

  it("un código incorrecto es un no, no un error", async () => {
    fakeApi({
      "POST /auth/verify-otp": { status: 400, json: { detail: { code: "otp_invalid" } } },
    });
    expect(await verifyShopRequestCode("forn@example.com", "000000")).toBe(false);
  });

  it("cada rechazo de la API se dice junto a su campo", () => {
    expect(shopRequestErrorFromApi(apiError(422, "tax_id_invalid"))).toBe("tax_id_invalid");
    expect(shopRequestErrorFromApi(apiError(409, "tax_id_already_registered"))).toBe(
      "tax_id_taken",
    );
    expect(shopRequestErrorFromApi(apiError(400, "Unknown postal code"))).toBe(
      "postal_code_unknown",
    );
    expect(shopRequestErrorFromApi(apiError(400, "postal_code_not_allowed"))).toBe(
      "postal_code_not_allowed",
    );
    for (const detail of [
      "Shop already registered for this email",
      "Merchant already has a shop",
      "Admin cannot also be merchant",
    ]) {
      expect(shopRequestErrorFromApi(apiError(409, detail))).toBe("email_taken");
    }
    expect(shopRequestErrorFromApi(apiError(500, "boom"))).toBe("generic");
    expect(shopRequestErrorFromApi(new TypeError("Failed to fetch"))).toBe("generic");
  });
});

describe("quien pidió el alta ve cómo va", () => {
  it("en revisión, o rechazada con el motivo", () => {
    expect(sessionShopRequestFromUser({ shop_request: null })).toBeNull();
    expect(
      sessionShopRequestFromUser({
        shop_request: { shop_id: "s1", name: "Forn", status: "review" },
      }),
    ).toEqual({ name: "Forn", status: "review", rejectionReason: null });
    expect(
      sessionShopRequestFromUser({
        shop_request: { shop_id: "s1", name: "Forn", status: "rejected", reason: "No existeix." },
      }),
    ).toEqual({ name: "Forn", status: "rejected", rejectionReason: "No existeix." });
  });

  it("entra en el panel solo para eso", () => {
    expect(canUseBackoffice(["resident"])).toBe(false);
    expect(canUseBackoffice(["resident"], true)).toBe(true);
    expect(canUseBackoffice(["resident", "merchant"])).toBe(true);
    expect(canUseBackoffice(["admin"])).toBe(true);
  });

  it("el día que se aprueba, la misma sesión pasa a ser la del comercio", async () => {
    useAuthStore.getState().signIn({
      token: "jwt-forn",
      user: {
        id: "u1",
        email: "forn@example.com",
        nomComerc: "forn@example.com",
        telefon: "",
        roles: ["resident"],
        shopRequest: { name: "Forn", status: "review" },
      },
    });
    fakeApi({
      "GET /users/me": { json: apiUser({ roles: ["resident", "merchant"], shop_id: "s1" }) },
    });

    expect(await getSessionShopRequest()).toEqual({ shopRequest: null });
    const user = useAuthStore.getState().user;
    expect(user?.roles).toContain("merchant");
    expect(user?.shopId).toBe("s1");
    expect(user?.shopRequest).toBeNull();
    expect(useAuthStore.getState().token).toBe("jwt-forn");
  });
});

describe("el administrador decide", () => {
  it("lista las pendientes de su municipio y lee las comprobaciones", async () => {
    const { calls } = fakeApi({
      "GET /shops?status=review": {
        json: [
          {
            id: "s1",
            town_id: "t1",
            name: "Forn",
            emoji: null,
            logo_url: null,
            hero_url: null,
            has_logo: false,
            has_hero: false,
            categories: ["bakery"],
            contact_email: "forn@example.com",
            tax_id: "B12345674",
            visit_points: 100,
            address: null,
            postal_code: "08380",
            phone: "937000000",
            website: null,
            description: null,
            opening_hours: null,
            status: "review",
            qr_code: null,
            is_fake: false,
            created_at: "2026-11-28T09:00:00",
            updated_at: "2026-11-28T09:00:00",
          },
        ],
      },
      "GET /shops/s1/review": {
        json: {
          status: "review",
          tax_id_valid: true,
          postal_code_in_town: true,
          email_verified: true,
          same_tax_id: [],
          similar_names: ["Forn Pere"],
          invited_by: "Marta",
          invite_points: 500,
        },
      },
    });

    const [shop] = await listPendingShopRequests();
    expect(shop).toMatchObject({ id: "s1", estat: "pendent_validar", taxId: "B12345674" });
    expect(await getShopReview("s1")).toEqual({
      status: "pending",
      taxIdValid: true,
      postalCodeInTown: true,
      emailVerified: true,
      sameTaxId: [],
      similarNames: ["Forn Pere"],
      invitedBy: "Marta",
      invitePoints: 500,
    });
    expect(calls.map((c) => c.path)).toEqual(["/shops?status=review", "/shops/s1/review"]);
  });

  it("aprobar y rechazar, con el motivo tal cual", async () => {
    const { calls } = fakeApi({
      "POST /shops/s1/approve": { json: {} },
      "POST /shops/s2/reject": { json: {} },
    });
    await approveShop("s1");
    await rejectShop("s2", "  No té botiga física.  ");
    expect(calls[1].body).toEqual({ reason: "No té botiga física." });
  });

  it("si otro se adelantó, lo dice; si falla, también", async () => {
    fakeApi({
      "POST /shops/s1/approve": { status: 409, json: { detail: "shop_not_in_review" } },
      "POST /shops/s2/approve": { status: 500, json: { detail: "boom" } },
    });
    await expect(approveShop("s1")).rejects.toEqual(new ShopDecisionError("already_decided"));
    await expect(approveShop("s2")).rejects.toMatchObject({ code: "generic" });
  });
});

describe("las plazas del piloto", () => {
  it("se leen y se guardan en el municipio del administrador; vacío es sin límite", async () => {
    const { calls } = fakeApi({
      "GET /towns/me": { json: { id: "t1", max_residents: 200, residents_count: 37 } },
      "PATCH /towns/t1": ({ body }) => ({
        json: { id: "t1", ...(body as object), residents_count: 37 },
      }),
    });

    expect(await getPilotLimit()).toEqual({ maxResidents: 200, residentsCount: 37 });
    expect(await savePilotLimit(null)).toEqual({ maxResidents: null, residentsCount: 37 });
    expect(calls.at(-1)).toMatchObject({ method: "PATCH", body: { max_residents: null } });
  });
});
