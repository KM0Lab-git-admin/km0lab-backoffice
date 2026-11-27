import { api } from "@/lib/apiClient";
import { veiFromResident } from "@/lib/mappers/admin";
import type { VeiPrograma } from "@/types/backoffice";
import type { ApiResident } from "@/types/api";

export const usuarisService = {
  async list(): Promise<VeiPrograma[]> {
    const residents = await api.get<ApiResident[]>("/residents");
    return residents.map(veiFromResident);
  },

  async get(id: string): Promise<VeiPrograma | undefined> {
    try {
      const resident = await api.get<ApiResident>(`/residents/${id}`);
      return veiFromResident(resident);
    } catch {
      return undefined;
    }
  },
};
