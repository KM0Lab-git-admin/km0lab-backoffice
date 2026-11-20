import { api, absoluteMediaUrl } from "@/lib/apiClient";
import {
  recompensaFromApi,
  recompensaToApi,
  recompensaEstatToApi,
} from "@/lib/mappers/admin";
import type { Recompensa, RecompensaInput } from "@/types/backoffice";
import type { ApiReward, ApiShop } from "@/types/api";

function dataUrlToBlob(dataUrl: string): { blob: Blob; filename: string } {
  const [header, data] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? "image/png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  return { blob: new Blob([bytes], { type: mime }), filename: `upload.${ext}` };
}

async function uploadImageIfDataUrl(
  rewardId: string,
  value: string | undefined,
): Promise<void> {
  if (!value?.startsWith("data:")) return;
  const { blob, filename } = dataUrlToBlob(value);
  const form = new FormData();
  form.append("file", blob, filename);
  await api.put(`/rewards/${rewardId}/media`, form, { rawBody: true });
}

async function deleteImageIfCleared(
  rewardId: string,
  value: string | undefined,
  hadImage: boolean,
): Promise<void> {
  // Only when the user explicitly cleared the uploader (no URL / no data URL).
  // Keep media if the form still has the persisted HTTP(S) media URL.
  if (!hadImage) return;
  if (value?.startsWith("data:") || value?.startsWith("http")) return;
  if (value) return;
  await api.delete(`/rewards/${rewardId}/media`);
}

export const recompensesService = {
  async list(): Promise<Recompensa[]> {
    const rows = await api.get<ApiReward[]>("/rewards");
    return rows.map(recompensaFromApi);
  },

  async get(id: string): Promise<Recompensa | undefined> {
    try {
      const reward = await api.get<ApiReward>(`/rewards/${id}`);
      return recompensaFromApi(reward);
    } catch {
      return undefined;
    }
  },

  async create(input: RecompensaInput): Promise<Recompensa> {
    const created = await api.post<ApiReward>("/rewards", recompensaToApi(input));
    await uploadImageIfDataUrl(created.id, input.imatgeUrl);
    const fresh = await api.get<ApiReward>(`/rewards/${created.id}`);
    return recompensaFromApi(fresh);
  },

  async update(id: string, input: RecompensaInput): Promise<Recompensa> {
    const before = await api.get<ApiReward>(`/rewards/${id}`);
    await api.patch<ApiReward>(`/rewards/${id}`, recompensaToApi(input));
    await uploadImageIfDataUrl(id, input.imatgeUrl);
    await deleteImageIfCleared(id, input.imatgeUrl, Boolean(before.has_image));
    const fresh = await api.get<ApiReward>(`/rewards/${id}`);
    const mapped = recompensaFromApi(fresh);
    if (input.imatgeUrl?.startsWith("data:") && !mapped.imatgeUrl) {
      mapped.imatgeUrl = absoluteMediaUrl(fresh.image_url) ?? input.imatgeUrl;
    }
    return mapped;
  },

  async setEstat(id: string, estat: "activa" | "inactiva"): Promise<void> {
    await api.patch(`/rewards/${id}`, { status: recompensaEstatToApi(estat) });
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/rewards/${id}`);
  },

  async getComercosOptions() {
    const shops = await api.get<ApiShop[]>("/shops");
    return shops.map((s) => ({ id: s.id, nom: s.name }));
  },
};
