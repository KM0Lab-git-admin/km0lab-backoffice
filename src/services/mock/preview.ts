// Mock helpers shared by the services in this folder: latency and preview params.

export const delay = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, ms + Math.random() * 200));

export const forever = () => new Promise<never>(() => undefined);

export function previewParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}
