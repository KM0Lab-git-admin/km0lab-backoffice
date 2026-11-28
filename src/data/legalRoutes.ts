// Single source for the App's legal pages. Production injects PUBLIC_APP_URL from config
// (real App or UAT). No screen writes a legal address by hand.

export const LEGAL_ROUTES = {
  shopTerms: "/condicions#comercos",
  privacy: "/privacitat",
} as const;

export type LegalRouteKey = keyof typeof LEGAL_ROUTES;

export const PUBLIC_APP_URL: string =
  (import.meta.env?.["VITE_PUBLIC_APP_URL"] as string | undefined) || "https://app.km0lab.com";

// Version of the pilot terms accepted on sign-up (sent as consent proof).
// Production: the one in force in km0lab-api (`CURRENT_TERMS_VERSION`), the
// same the residents' App accepts. Raise both together.
export const TERMS_VERSION = "2";

export function legalUrl(key: LegalRouteKey, base: string = PUBLIC_APP_URL): string {
  return `${base.replace(/\/$/, "")}${LEGAL_ROUTES[key]}`;
}
