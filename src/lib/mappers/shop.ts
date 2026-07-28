import { absoluteMediaUrl } from "@/lib/apiClient";
import { categoriesFromApi, categoriesToApi } from "@/lib/mappers/categories";
import { horariFromApi, horariToApi } from "@/lib/mappers/horari";
import type { ComercFitxa, ComercFitxaInput, ComercMe, ComercQR, QRMetrics } from "@/types/comerc";
import type { ApiQr, ApiShop } from "@/types/api";

export function comercMeFromShop(shop: ApiShop): ComercMe {
  return {
    id: shop.id,
    nom: shop.name,
    emoji: shop.emoji ?? undefined,
    adherit: true,
  };
}

export function fitxaFromShop(shop: ApiShop): ComercFitxa {
  return {
    id: shop.id,
    nom: shop.name,
    categories: categoriesFromApi(shop.categories ?? []),
    descripcio: shop.description ?? "",
    logoUrl: absoluteMediaUrl(shop.logo_url),
    heroUrl: absoluteMediaUrl(shop.hero_url),
    adreca: shop.address ?? "",
    codiPostal: shop.postal_code ?? "",
    poblacio: "",
    telefon: shop.phone ?? "",
    web: shop.website ?? "",
    horari: horariFromApi(shop.opening_hours),
  };
}

export function fitxaToProfileUpdate(input: ComercFitxaInput): Record<string, unknown> {
  return {
    name: input.nom,
    categories: categoriesToApi(input.categories),
    description: input.descripcio,
    address: input.adreca || null,
    postal_code: input.codiPostal || null,
    phone: input.telefon || null,
    website: input.web || null,
    opening_hours: horariToApi(input.horari),
  };
}

export function qrFromApi(qr: ApiQr): ComercQR {
  return {
    comercId: qr.shop_id,
    codi: qr.qr_code,
    puntsPerVisita: qr.visit_points,
    pngUrl: absoluteMediaUrl(qr.png_url),
  };
}

export function qrMetricsFromApi(qr: ApiQr): QRMetrics {
  return {
    visites: qr.total_scans,
    puntsAtorgats: qr.points_awarded,
    nousVisitantsSetmana: 0,
  };
}
