import type { ComercAdmin, ComercAdminInput, ComercEstat } from "@/types/backoffice";
import { useAdminComercosStore } from "@/stores/useAdminComercosStore";
import { useSessionStore } from "@/stores/useSessionStore";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms + Math.random() * 200));

function newId(nom: string): string {
  const slug = nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);
  return `${slug || "comerc"}-${Math.random().toString(36).slice(2, 6)}`;
}

export const adminComercosService = {
  async list(): Promise<ComercAdmin[]> {
    await delay(350);
    const { poblacioId } = useSessionStore.getState();
    return useAdminComercosStore
      .getState()
      .comercos.filter((c) => c.poblacioId === poblacioId);
  },

  async get(id: string): Promise<ComercAdmin | undefined> {
    await delay(200);
    return useAdminComercosStore.getState().comercos.find((c) => c.id === id);
  },

  async create(input: ComercAdminInput): Promise<ComercAdmin> {
    await delay(500);
    const { poblacioId } = useSessionStore.getState();
    const c: ComercAdmin = {
      ...input,
      id: newId(input.nom),
      poblacioId,
      estat: "pendent",
      qrGenerat: true,
      nPromocionsActives: 0,
      dataAlta: new Date().toISOString(),
    };
    useAdminComercosStore.getState().upsert(c);
    return c;
  },

  async update(id: string, input: ComercAdminInput): Promise<ComercAdmin> {
    await delay(400);
    const current = useAdminComercosStore.getState().comercos.find((c) => c.id === id);
    if (!current) throw new Error("not_found");
    const c: ComercAdmin = { ...current, ...input };
    useAdminComercosStore.getState().upsert(c);
    return c;
  },

  async setEstat(id: string, estat: ComercEstat): Promise<void> {
    await delay(250);
    useAdminComercosStore.getState().setEstat(id, estat);
  },

  async remove(id: string): Promise<void> {
    await delay(300);
    useAdminComercosStore.getState().remove(id);
  },
};
