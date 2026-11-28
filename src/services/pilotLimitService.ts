// How many residents the municipality's pilot admits, and how many it has.
//
// Production (locked). The screen calls these through
// `services/mock/pilotLimitService`, which here only re-exports this file.
import { api } from "@/lib/apiClient";
import type { ApiTown } from "@/types/api";
import type { PilotLimit } from "@/types/shopRequest";

export function pilotLimitFromTown(
  town: Pick<ApiTown, "max_residents" | "residents_count">,
): PilotLimit {
  return {
    maxResidents: town.max_residents ?? null,
    residentsCount: town.residents_count ?? 0,
  };
}

export async function getPilotLimit(): Promise<PilotLimit> {
  return pilotLimitFromTown(await api.get<ApiTown>("/towns/me"));
}

/** `null` removes the limit. */
export async function savePilotLimit(maxResidents: number | null): Promise<PilotLimit> {
  const mine = await api.get<ApiTown>("/towns/me");
  const town = await api.patch<ApiTown>(`/towns/${mine.id}`, { max_residents: maxResidents });
  return pilotLimitFromTown(town);
}
