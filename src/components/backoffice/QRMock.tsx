/**
 * MOCK QR renderer.
 *
 * Production will replace this with a real QR (or the pre-generated PNG/PDF)
 * without touching the surrounding UI. Deliberately not using a QR encoder
 * dependency; we render a decorative grid that reads as a QR at a glance.
 */
type Props = {
  value: string;
  size?: number;
  className?: string;
};

// Deterministic pseudo-random from a string, so the same code always renders
// the same visual pattern.
function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID = 25;

export function QRMock({ value, size = 240, className }: Props) {
  const rand = mulberry32(hashSeed(value));
  const cells: boolean[] = [];
  for (let i = 0; i < GRID * GRID; i++) cells.push(rand() > 0.5);

  const isFinder = (r: number, c: number) => {
    const inCorner = (or: number, oc: number) =>
      r >= or && r < or + 7 && c >= oc && c < oc + 7;
    return inCorner(0, 0) || inCorner(0, GRID - 7) || inCorner(GRID - 7, 0);
  };

  const finderPixel = (r: number, c: number) => {
    const local = (or: number, oc: number) => {
      const rr = r - or;
      const cc = c - oc;
      if (rr < 0 || cc < 0 || rr > 6 || cc > 6) return null;
      const onBorder = rr === 0 || rr === 6 || cc === 0 || cc === 6;
      const onCore = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
      return onBorder || onCore;
    };
    return local(0, 0) ?? local(0, GRID - 7) ?? local(GRID - 7, 0) ?? false;
  };

  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`QR ${value}`}
      shapeRendering="crispEdges"
    >
      <rect width={GRID} height={GRID} fill="white" />
      {Array.from({ length: GRID * GRID }).map((_, i) => {
        const r = Math.floor(i / GRID);
        const c = i % GRID;
        const on = isFinder(r, c) ? finderPixel(r, c) : cells[i];
        if (!on) return null;
        return <rect key={i} x={c} y={r} width={1} height={1} fill="currentColor" />;
      })}
    </svg>
  );
}
