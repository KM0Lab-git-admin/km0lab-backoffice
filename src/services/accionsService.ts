import { api } from "@/lib/apiClient";
import { accioFromApi, accioToApi } from "@/lib/mappers/admin";
import type { AccioPunts, AccioPuntsInput, AccioPuntsTipus } from "@/types/backoffice";
import type { ApiPointAction, ApiShop } from "@/types/api";

export const accioTipusList: AccioPuntsTipus[] = [
  "registre",
  "primer_escaneig",
  "escaneig_qr",
  "aniversari",
  "visita_web",
  "registre_web",
  "esdeveniment",
  "personalitzada",
  "invitacio_persona",
  "invitacio_negoci",
];

export const accionsService = {
  async list(): Promise<AccioPunts[]> {
    const rows = await api.get<ApiPointAction[]>("/actions");
    return rows.map(accioFromApi);
  },

  async get(id: string): Promise<AccioPunts | undefined> {
    const rows = await api.get<ApiPointAction[]>("/actions");
    const found = rows.find((a) => a.id === id);
    return found ? accioFromApi(found) : undefined;
  },

  async create(input: AccioPuntsInput): Promise<AccioPunts> {
    const created = await api.post<ApiPointAction>("/actions", accioToApi(input));
    return accioFromApi(created);
  },

  async update(id: string, input: AccioPuntsInput): Promise<AccioPunts> {
    const updated = await api.patch<ApiPointAction>(
      `/actions/${id}`,
      accioToApi(input),
    );
    return accioFromApi(updated);
  },

  async toggle(id: string, activa: boolean): Promise<void> {
    await api.post(`/actions/${id}/${activa ? "activate" : "deactivate"}`);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/actions/${id}`);
  },

  async getComercosOptions() {
    const shops = await api.get<ApiShop[]>("/shops");
    return shops.map((s) => ({ id: s.id, nom: s.name }));
  },
};
