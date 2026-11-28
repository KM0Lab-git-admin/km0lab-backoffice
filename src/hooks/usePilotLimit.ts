import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPilotLimit, savePilotLimit } from "@/services/mock/pilotLimitService";

const key = ["admin", "pilotLimit"] as const;

export function usePilotLimit() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: key, queryFn: () => getPilotLimit() });
  const save = useMutation({
    mutationFn: (maxResidents: number | null) => savePilotLimit(maxResidents),
    onSuccess: (data) => qc.setQueryData(key, data),
  });
  return { query, save };
}
