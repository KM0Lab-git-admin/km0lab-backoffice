import { api } from "@/lib/apiClient";

export type AdminInviteConversion = {
  id: string;
  kind: "person" | "business";
  status: string;
  display_name: string | null;
  completed_at: string | null;
  granted_at: string | null;
  points: number;
  inviter_user_id: string | null;
  invitee_user_id: string | null;
  shop_id: string | null;
  public_code: string | null;
};

export type AdminInviteList = {
  conversions: AdminInviteConversion[];
  total: number;
  persons_registered: number;
  businesses_registered: number;
  points_granted: number;
  share_events: number;
};

export const invitationsService = {
  list(params: {
    kind?: string;
    status?: string;
    inviterUserId?: string;
  } = {}): Promise<AdminInviteList> {
    const qs = new URLSearchParams();
    if (params.kind) qs.set("kind", params.kind);
    if (params.status) qs.set("status", params.status);
    if (params.inviterUserId) qs.set("inviter_user_id", params.inviterUserId);
    const suffix = qs.toString() ? `?${qs}` : "";
    return api.get<AdminInviteList>(`/admin/invites${suffix}`);
  },

  get(id: string): Promise<AdminInviteConversion> {
    return api.get<AdminInviteConversion>(`/admin/invites/conversions/${id}`);
  },

  retryReward(id: string): Promise<AdminInviteConversion> {
    return api.post<AdminInviteConversion>(
      `/admin/invites/conversions/${id}/retry-reward`,
      {},
    );
  },
};
