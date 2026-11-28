import { useQuery } from "@tanstack/react-query";
import { listPendingShopRequests } from "@/services/mock/shopReviewService";

export const pendingShopRequestsKey = ["admin", "comercos", "pending"] as const;

export function usePendingShopRequests(enabled = true) {
  return useQuery({
    queryKey: pendingShopRequestsKey,
    queryFn: () => listPendingShopRequests(),
    enabled,
  });
}
