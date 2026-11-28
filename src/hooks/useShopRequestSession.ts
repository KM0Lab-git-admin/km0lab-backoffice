import { useQuery } from "@tanstack/react-query";
import { getSessionShopRequest } from "@/services/mock/shopRequestService";

export function useShopRequestSession() {
  return useQuery({
    queryKey: ["session", "shopRequest"],
    queryFn: () => getSessionShopRequest(),
  });
}
