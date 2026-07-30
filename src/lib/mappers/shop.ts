import { absoluteMediaUrl } from "@/lib/apiClient";
import { categoriesFromApi, categoriesToApi } from "@/lib/mappers/categories";
import { horariFromApi, horariToApi } from "@/lib/mappers/horari";
import type { ComercFitxa, ComercFitxaInput, ComercMe, ComercQR, QRMetrics } from "@/types/merchant";
import type { ApiQr, ApiShop } from "@/types/api";
import { normalizeLang, pickPlain, seedI18n } from "@/types/i18n";

export function comercMeFromShop(shop: ApiShop): ComercMe {
  return {
    id: shop.id,
    nom: shop.name,
    emoji: shop.emoji ?? undefined,
    adherit: true,
  };
}

export function fitxaFromShop(shop: ApiShop): ComercFitxa {
  const idiomaOrigen = normalizeLang(shop.i18n_source_lang);
  return {
    id: shop.id,
    nom: shop.name,
    categories: categoriesFromApi(shop.categories ?? []),
    descripcio: shop.description ?? "",
    descripcioI18n: seedI18n(shop.description, idiomaOrigen, shop.description_i18n),
    idiomaOrigen,
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
  const idiomaOrigen = normalizeLang(input.idiomaOrigen);
  const descripcioI18n = seedI18n(
    input.descripcio,
    idiomaOrigen,
    input.descripcioI18n,
  );
  return {
    name: input.nom,
    categories: categoriesToApi(input.categories),
    description: pickPlain(descripcioI18n, idiomaOrigen, input.descripcio),
    description_i18n: descripcioI18n,
    i18n_source_lang: idiomaOrigen,
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
