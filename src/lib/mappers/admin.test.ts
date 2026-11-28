import { describe, expect, it } from "vitest";

import {
  adminStatsFromApi,
  comercAdminFromShop,
  comercEstatToApi,
  signupProviderFromApi,
  veiFromResident,
} from "@/lib/mappers/admin";
import type { ApiResident, ApiShop } from "@/types/api";

const shop = (status: string): ApiShop => ({
  id: "s1",
  town_id: "t1",
  name: "Forn",
  emoji: null,
  logo_url: null,
  hero_url: null,
  has_logo: false,
  has_hero: false,
  categories: [],
  contact_email: "forn@example.com",
  visit_points: 100,
  address: null,
  postal_code: null,
  phone: null,
  website: null,
  description: null,
  opening_hours: null,
  status,
  qr_code: null,
  is_fake: false,
  created_at: "2026-11-28T09:00:00",
  updated_at: "2026-11-28T09:00:00",
});

describe("los cinco estados de un comercio", () => {
  it("cada uno con su nombre", () => {
    expect(comercAdminFromShop(shop("active")).estat).toBe("actiu");
    expect(comercAdminFromShop(shop("inactive")).estat).toBe("inactiu");
    // Antes «pending» salía como «Inactiu», que confundía.
    expect(comercAdminFromShop(shop("pending")).estat).toBe("esperant_comerc");
    expect(comercAdminFromShop(shop("review")).estat).toBe("pendent_validar");
    expect(comercAdminFromShop(shop("rejected")).estat).toBe("rebutjat");
  });

  it("el interruptor solo enciende y apaga", () => {
    expect(comercEstatToApi("actiu")).toBe("active");
    expect(comercEstatToApi("inactiu")).toBe("inactive");
  });
});

describe("por dónde entró cada vecino", () => {
  const resident: ApiResident = {
    id: "u1",
    slug: "marta",
    first_name: "Marta",
    last_name: null,
    name: "Marta",
    points: 200,
    town_id: "t1",
    contact_shared: false,
    email: "x7k@privaterelay.appleid.com",
    phone: null,
    created_at: "2026-11-01T10:00:00",
    signup_provider: "apple",
    signup_at: "2026-11-01T10:00:00",
    email_hidden: true,
    identities: [
      { provider: "apple", linked_at: "2026-11-01T10:00:00", last_used_at: null },
      {
        provider: "email_code",
        linked_at: "2026-11-20T10:00:00",
        last_used_at: "2026-11-28T08:00:00",
      },
      { provider: "telepathy", linked_at: "2026-11-21T10:00:00", last_used_at: null },
    ],
    activity: [],
  };

  it("la ficha trae el origen, el correo oculto y las puertas que conoce", () => {
    const v = veiFromResident(resident);
    expect(v.signupProvider).toBe("apple");
    expect(v.emailHidden).toBe(true);
    expect(v.identities.map((d) => d.provider)).toEqual(["apple", "email_code"]);
  });

  it("una cuenta que nunca entró no tiene origen", () => {
    const v = veiFromResident({ ...resident, signup_provider: null, identities: undefined });
    expect(v.signupProvider).toBeNull();
    expect(v.identities).toEqual([]);
    expect(signupProviderFromApi(undefined)).toBeNull();
  });

  it("la cifra del resumen, con las cuatro puertas aunque falte alguna", () => {
    const stats = adminStatsFromApi({
      active_users: 3,
      points_in_circulation: 600,
      redemptions_this_month: 0,
      active_actions: 3,
      total_actions: 5,
      signups_by_provider: { email_code: 2, google: 1 },
    });
    expect(stats.signupsByProvider).toEqual({ email_code: 2, google: 1, facebook: 0, apple: 0 });
    // Una API anterior que no manda la cifra.
    expect(
      adminStatsFromApi({
        active_users: 0,
        points_in_circulation: 0,
        redemptions_this_month: 0,
        active_actions: 0,
        total_actions: 0,
      }).signupsByProvider,
    ).toEqual({ email_code: 0, google: 0, facebook: 0, apple: 0 });
  });
});
