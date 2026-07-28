import { api, absoluteMediaUrl } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";
import { fitxaFromShop, fitxaToProfileUpdate } from "@/lib/mappers/shop";
import type { ComercFitxa, ComercFitxaInput } from "@/types/comerc";
import type { ApiShop } from "@/types/api";

function dataUrlToBlob(dataUrl: string): { blob: Blob; filename: string } {
  const [header, data] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? "image/png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  return { blob: new Blob([bytes], { type: mime }), filename: `upload.${ext}` };
}

async function uploadMediaIfDataUrl(
  kind: "logo" | "hero",
  value: string | undefined,
): Promise<void> {
  if (!value?.startsWith("data:")) return;
  const { blob, filename } = dataUrlToBlob(value);
  const form = new FormData();
  form.append("file", blob, filename);
  await api.put(`/shops/me/media/${kind}`, form, { rawBody: true });
}

async function deleteMediaIfCleared(
  kind: "logo" | "hero",
  value: string | undefined,
  hadMedia: boolean,
): Promise<void> {
  if (hadMedia && !value) {
    await api.delete(`/shops/me/media/${kind}`);
  }
}

export const fitxaService = {
  async getFitxa(): Promise<ComercFitxa> {
    const shop = await api.get<ApiShop>("/shops/me");
    const fitxa = fitxaFromShop(shop);
    const townName = useAuthStore.getState().user?.townName;
    if (townName) fitxa.poblacio = townName;
    return fitxa;
  },

  async updateFitxa(input: ComercFitxaInput): Promise<ComercFitxa> {
    const before = await api.get<ApiShop>("/shops/me");

    await uploadMediaIfDataUrl("logo", input.logoUrl);
    await uploadMediaIfDataUrl("hero", input.heroUrl);
    await deleteMediaIfCleared("logo", input.logoUrl, before.has_logo);
    await deleteMediaIfCleared("hero", input.heroUrl, before.has_hero);

    const shop = await api.patch<ApiShop>(
      "/shops/me",
      fitxaToProfileUpdate(input),
    );
    const fitxa = fitxaFromShop(shop);
    fitxa.poblacio =
      input.poblacio || useAuthStore.getState().user?.townName || "";
    fitxa.logoUrl = absoluteMediaUrl(shop.logo_url) ?? input.logoUrl;
    fitxa.heroUrl = absoluteMediaUrl(shop.hero_url) ?? input.heroUrl;
    return fitxa;
  },
};
