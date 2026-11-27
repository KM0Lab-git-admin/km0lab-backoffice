import { api, absoluteMediaUrl } from "@/lib/apiClient";
import { configFromTown, configToTownUpdate } from "@/lib/mappers/admin";
import { useSessionStore } from "@/stores/useSessionStore";
import type { PoblacioConfig, PoblacioConfigInput } from "@/types/backoffice";
import type { ApiTown } from "@/types/api";

function dataUrlToBlob(dataUrl: string): { blob: Blob; filename: string } {
  const [header, data] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? "image/png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  return { blob: new Blob([bytes], { type: mime }), filename: `logo.${ext}` };
}

async function uploadLogoIfDataUrl(
  townId: string,
  value: string | undefined,
): Promise<void> {
  if (!value?.startsWith("data:")) return;
  const { blob, filename } = dataUrlToBlob(value);
  const form = new FormData();
  form.append("file", blob, filename);
  await api.put(`/towns/${townId}/media/logo`, form, { rawBody: true });
}

async function deleteLogoIfCleared(
  townId: string,
  value: string | undefined,
  hadLogo: boolean,
): Promise<void> {
  if (!hadLogo) return;
  if (value?.startsWith("data:") || value?.startsWith("http")) return;
  if (value) return;
  await api.delete(`/towns/${townId}/media/logo`);
}

export const configService = {
  async get(_poblacioId?: string): Promise<PoblacioConfig> {
    const town = await api.get<ApiTown>("/towns/me");
    return configFromTown(town);
  },

  async update(
    poblacioId: string,
    input: PoblacioConfigInput,
  ): Promise<PoblacioConfig> {
    const before = await api.get<ApiTown>(`/towns/${poblacioId}`);
    const town = await api.patch<ApiTown>(
      `/towns/${poblacioId}`,
      configToTownUpdate(input),
    );
    await uploadLogoIfDataUrl(poblacioId, input.logoUrl);
    await deleteLogoIfCleared(
      poblacioId,
      input.logoUrl,
      Boolean(before.has_logo || before.logo_url),
    );
    const fresh = await api.get<ApiTown>(`/towns/${poblacioId}`);
    useSessionStore.getState().setSession({
      ...useSessionStore.getState(),
      poblacioId: fresh.id,
    });
    const mapped = configFromTown(fresh);
    if (input.logoUrl?.startsWith("data:") && !mapped.logoUrl) {
      mapped.logoUrl = absoluteMediaUrl(fresh.logo_url) ?? input.logoUrl;
    }
    return mapped;
  },

  async exportData(poblacioId: string): Promise<{ ok: true; poblacioId: string }> {
    // Not implemented in API yet.
    return { ok: true, poblacioId };
  },

  async regenerateCredentials(
    poblacioId: string,
  ): Promise<{ ok: true; poblacioId: string }> {
    return { ok: true, poblacioId };
  },

  async deactivateProgram(
    poblacioId: string,
  ): Promise<{ ok: true; poblacioId: string }> {
    return { ok: true, poblacioId };
  },
};
