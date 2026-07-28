import type { PagamentComerc } from "@/types/backoffice";

const iso = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const pagamentsFixture: PagamentComerc[] = [
  {
    id: "p-1",
    poblacioId: "malgrat",
    comercId: "cafe-del-mar",
    comercNom: "Cafè del Mar",
    data: iso(20),
    bescanviIds: ["b-10"],
    importTotal: 20,
    nota: "Transferència bancària",
  },
];
