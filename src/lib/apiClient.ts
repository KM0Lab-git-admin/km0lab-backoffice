import { useAuthStore } from "@/stores/useAuthStore";

const API_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:8000/api/v1"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export function getApiBaseUrl(): string {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured");
  }
  return API_URL;
}

/** Origin without /api/v1 — used to absolutize media paths like /api/v1/shops/.../media/logo */
export function getApiOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/v1$/, "");
}

export function absoluteMediaUrl(
  path: string | null | undefined,
): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = getApiOrigin();
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  auth?: boolean;
  headers?: Record<string, string>;
  /** When true, do not JSON-stringify body (FormData / Blob). */
  rawBody?: boolean;
};

async function parseError(res: Response): Promise<ApiError> {
  let detail: unknown;
  let message = res.statusText || `HTTP ${res.status}`;
  try {
    const data = await res.json();
    detail = data;
    if (typeof data?.detail === "string") message = data.detail;
    else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((d: { msg?: string }) => d.msg ?? JSON.stringify(d))
        .join("; ");
    } else if (data?.message) message = String(data.message);
  } catch {
    // ignore non-JSON error bodies
  }
  return new ApiError(res.status, message, detail);
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
    headers = {},
    rawBody = false,
  } = options;

  const url = path.startsWith("http")
    ? path
    : `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const token =
    options.token !== undefined
      ? options.token
      : auth
        ? useAuthStore.getState().token
        : null;

  const reqHeaders: Record<string, string> = { ...headers };
  if (token) reqHeaders.Authorization = `Bearer ${token}`;
  if (body !== undefined && !rawBody && !(body instanceof FormData)) {
    reqHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body:
      body === undefined
        ? undefined
        : rawBody || body instanceof FormData
          ? (body as BodyInit)
          : JSON.stringify(body),
  });

  if (res.status === 401 && auth) {
    useAuthStore.getState().signOut();
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  // Binary / text fallbacks for callers that cast appropriately.
  return (await res.blob()) as T;
}

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">,
  ) => apiRequest<T>(path, { ...opts, method: "POST", body }),

  patch: <T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">,
  ) => apiRequest<T>(path, { ...opts, method: "PATCH", body }),

  put: <T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">,
  ) => apiRequest<T>(path, { ...opts, method: "PUT", body }),

  delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "DELETE" }),
};
