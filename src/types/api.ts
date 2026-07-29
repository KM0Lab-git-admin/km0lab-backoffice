/** Wire shapes matching km0lab-api /api/v1 OpenAPI schemas. */

export type ApiUser = {
  id: string;
  email: string;
  slug: string;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  lang: string;
  postal_code: string | null;
  town_id: string | null;
  town_name: string | null;
  points: number;
  roles: string[];
  shop_id: string | null;
  phone: string | null;
  contact_shared: boolean;
  is_fake: boolean;
  created_at: string;
};

export type ApiAuthOut = {
  access_token: string;
  token_type: string;
  user: ApiUser;
};

export type ApiDayHours = {
  closed: boolean;
  opens: string | null;
  closes: string | null;
  opens_2?: string | null;
  closes_2?: string | null;
};

export type ApiOpeningHours = {
  monday: ApiDayHours;
  tuesday: ApiDayHours;
  wednesday: ApiDayHours;
  thursday: ApiDayHours;
  friday: ApiDayHours;
  saturday: ApiDayHours;
  sunday: ApiDayHours;
};

export type ApiShop = {
  id: string;
  town_id: string;
  name: string;
  emoji: string | null;
  logo_url: string | null;
  hero_url: string | null;
  has_logo: boolean;
  has_hero: boolean;
  categories: string[];
  contact_email: string;
  visit_points: number;
  address: string | null;
  postal_code: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  opening_hours: ApiOpeningHours | null;
  status: string;
  qr_code: string | null;
  is_fake: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiQr = {
  shop_id: string;
  qr_code: string;
  scan_url: string;
  png_url: string;
  visit_points: number;
  total_scans: number;
  points_awarded: number;
};

export type ApiPromotion = {
  id: string;
  shop_id: string;
  type: string;
  label: string;
  title: string;
  detail: string;
  value: string | null;
  min_purchase: string | null;
  valid_from: string | null;
  valid_until: string | null;
  conditions: string | null;
  active: boolean;
  is_fake: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiAdminStats = {
  active_users: number;
  points_in_circulation: number;
  redemptions_this_month: number;
  active_actions: number;
  total_actions: number;
};

export type ApiMerchantStats = {
  total_scans: number;
  unique_visitors: number;
  points_awarded: number;
  active_promotions: number;
};

export type ApiResidentActivity = {
  id: string;
  type: string;
  description: string | null;
  points: number;
  created_at: string;
};

export type ApiResident = {
  id: string;
  slug: string;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  points: number;
  town_id: string | null;
  contact_shared: boolean;
  email: string | null;
  phone: string | null;
  created_at: string;
  activity: ApiResidentActivity[];
};

export type ApiRedemptionEvent = {
  status: string;
  note: string | null;
  created_at: string;
};

export type ApiRedemption = {
  id: string;
  town_id: string;
  user_id: string;
  reward_id: string;
  flow: string;
  points_spent: number;
  status: string;
  code: string | null;
  amount: string | null;
  shop_id: string | null;
  used_at: string | null;
  amount_applied: string | null;
  payment_id: string | null;
  delivered_at: string | null;
  requested_at: string;
  is_fake: boolean;
  events: ApiRedemptionEvent[];
};

export type ApiShopDebt = {
  shop_id: string;
  shop_name: string;
  pending_count: number;
  pending_amount: number;
  paid_total: number;
};

export type ApiShopPayment = {
  id: string;
  town_id: string;
  shop_id: string;
  shop_name: string;
  total_amount: number;
  note: string | null;
  redemption_ids: string[];
  is_fake: boolean;
  created_at: string;
};

export type ApiPointAction = {
  id: string;
  town_id: string;
  type: string;
  name: string;
  description: string;
  points: number;
  per_user_limit: number | null;
  total_limit: number | null;
  valid_from: string | null;
  valid_until: string | null;
  conditions: string | null;
  active: boolean;
  url: string | null;
  event_id: string | null;
  shop_id: string | null;
  cooldown_days: number | null;
  is_fake: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiReward = {
  id: string;
  town_id: string;
  name: string;
  description: string;
  image_url: string | null;
  has_image?: boolean;
  type: string;
  points_required: number;
  value: string | null;
  stock: number | null;
  valid_from: string | null;
  valid_until: string | null;
  conditions: string | null;
  status: string;
  shop_ids: string[];
  is_fake: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiTown = {
  id: string;
  name: string;
  slug: string;
  entity_name: string;
  entity_type: string;
  contact_email: string;
  manager_name: string;
  logo_url: string | null;
  expiry_months: number | null;
  postal_codes: { postal_code: string; is_primary: boolean }[];
  created_at: string;
  updated_at: string;
};

export type ApiShopCategory = {
  slug: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};
