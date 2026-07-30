import { absoluteMediaUrl } from "@/lib/apiClient";
import { categoriesFromApi, categoriesToApi } from "@/lib/mappers/categories";
import { horariFromApi, horariToApi } from "@/lib/mappers/horari";
import type { ComercFitxa, ComercFitxaInput, ComercMe, ComercQR, QRMetrics } from "@/types/merchant";
import type { ApiQr, ApiShop } from "@/types/api";
import {
  normalizeLang,
  pickPlain,
  seedI18n,
  i18nToApiPayload,
} from "@/types/i18n";

export function comercMeFromShop(shop: ApiShop): ComercMe {
  const bust = shop.updated_at ? `?v=${encodeURIComponent(shop.updated_at)}` : "";
  const logo = absoluteMediaUrl(shop.logo_url);
  return {
    id: shop.id,
    nom: shop.name,
    emoji: shop.emoji ?? undefined,
    logoUrl: logo ? `${logo}${bust}` : undefined,
    adherit: true,
  };
}

export function fitxaFromShop(shop: ApiShop): ComercFitxa {
  const idiomaOrigen = normalizeLang(shop.i18n_source_lang);
  const bust = shop.updated_at ? `?v=${encodeURIComponent(shop.updated_at)}` : "";
  const logo = absoluteMediaUrl(shop.logo_url);
  const hero = absoluteMediaUrl(shop.hero_url);
  return {
    id: shop.id,
    nom: shop.name,
    categories: categoriesFromApi(shop.categories ?? []),
    descripcio: shop.description ?? "",
    descripcioI18n: seedI18n(shop.description, idiomaOrigen, shop.description_i18n),
    idiomaOrigen,
    logoUrl: logo ? `${logo}${bust}` : undefined,
    heroUrl: hero ? `${hero}${bust}` : undefined,
    adreca: shop.address ?? "",
    codiPostal: shop.postal_code ?? "",
    poblacio: shop.town_name ?? "",
    telefon: shop.phone ?? "",
    web: shop.website ?? "",
    horari: horariFromApi(shop.opening_hours),
  };
}

export function fitxaToProfileUpdate(input: ComercFitxaInput): Record<string, unknown> {
  const idiomaOrigen = normalizeLang(input.idiomaOrigen);
  const descripcioI18n = i18nToApiPayload(
    input.descripcioI18n,
    idiomaOrigen,
    input.descripcio,
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
