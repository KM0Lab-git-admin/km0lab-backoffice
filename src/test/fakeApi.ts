// A make-believe km0lab-api for the quick tests: it replaces `fetch` and lets
// everything else run for real (the client, the services, the mappers). So a
// test checks at once what the panel sends and whether it understands what
// it gets back.
import { vi } from "vitest";

export type Call = { method: string; path: string; body: unknown; auth: string | null };
type Reply = { status?: number; json?: unknown };
type Handler = Reply | ((call: Call) => Reply);

const API = "http://api.test/api/v1";

export function fakeApi(routes: Record<string, Handler>) {
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      const method = (init?.method ?? "GET").toUpperCase();
      const path = url.replace(API, "");
      const headers = (init?.headers ?? {}) as Record<string, string>;
      const call: Call = {
        method,
        path,
        body: typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
        auth: headers.Authorization ?? null,
      };
      calls.push(call);
      const handler = routes[`${method} ${path}`] ?? routes[`${method} ${path.split("?")[0]}`];
      if (!handler) throw new Error(`Petición no prevista en la prueba: ${method} ${path}`);
      const reply = typeof handler === "function" ? handler(call) : handler;
      return new Response(JSON.stringify(reply.json ?? null), {
        status: reply.status ?? 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  );
  return { calls };
}

/** What the API answers for a user (login, /users/me). */
export function apiUser(over: Record<string, unknown> = {}) {
  return {
    id: "u1",
    email: "forn@example.com",
    slug: "forn",
    first_name: null,
    last_name: null,
    name: null,
    lang: "ca",
    postal_code: "08380",
    town_id: "t1",
    town_name: "Malgrat de Mar",
    points: 0,
    roles: ["resident"],
    shop_id: null,
    phone: null,
    contact_shared: false,
    is_fake: false,
    created_at: "2026-11-28T09:00:00",
    shop_request: null,
    ...over,
  };
}
