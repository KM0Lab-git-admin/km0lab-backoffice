import type { VeiActivitat, VeiPrograma } from "@/types/backoffice";

const iso = (daysAgo: number, hoursAgo = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

function actEscaneig(
  id: string,
  daysAgo: number,
  comerc: string,
  punts: number,
): VeiActivitat {
  return {
    id,
    tipus: "escaneig",
    descripcio: comerc,
    data: iso(daysAgo),
    punts,
  };
}

function actAccio(id: string, daysAgo: number, nom: string, punts: number): VeiActivitat {
  return { id, tipus: "accio", descripcio: nom, data: iso(daysAgo), punts };
}

function actBescanvi(
  id: string,
  daysAgo: number,
  recompensa: string,
  punts: number,
): VeiActivitat {
  return {
    id,
    tipus: "bescanvi",
    descripcio: recompensa,
    data: iso(daysAgo),
    punts: -punts,
  };
}

export const veinsFixture: VeiPrograma[] = [
  {
    id: "u-marc-p",
    poblacioId: "malgrat",
    nom: "Marc P.",
    puntsAcumulats: 1260,
    nivell: 4,
    escanejos: 18,
    comercosVisitats: 7,
    bescanvis: 1,
    dataAlta: iso(150),
    ultimaActivitat: iso(0, 2),
    contacteCompartit: true,
    email: "marc.p@example.cat",
    telefon: "+34 612 000 001",
    activitat: [
      actEscaneig("m1", 0, "Forn Rovira", 20),
      actEscaneig("m2", 1, "Cafè del Mar", 15),
      actAccio("m3", 3, "Visita la web de turisme", 20),
      actBescanvi("m4", 12, "Val de 5€", 1000),
      actEscaneig("m5", 20, "Peixateria Marina", 20),
    ],
  },
  {
    id: "u-laia-r",
    poblacioId: "malgrat",
    nom: "Laia R.",
    puntsAcumulats: 980,
    nivell: 3,
    escanejos: 12,
    comercosVisitats: 5,
    bescanvis: 0,
    dataAlta: iso(90),
    ultimaActivitat: iso(1),
    contacteCompartit: true,
    email: "laia.r@example.cat",
    activitat: [
      actEscaneig("l1", 1, "Cal Sastre", 25),
      actEscaneig("l2", 4, "Forn Rovira", 20),
      actAccio("l3", 8, "Primer escaneig d'un comerç", 50),
    ],
  },
  {
    id: "u-joan-s",
    poblacioId: "malgrat",
    nom: "Joan S.",
    puntsAcumulats: 2140,
    nivell: 5,
    escanejos: 34,
    comercosVisitats: 9,
    bescanvis: 3,
    dataAlta: iso(220),
    ultimaActivitat: iso(0, 5),
    contacteCompartit: false,
    activitat: [
      actEscaneig("j1", 0, "Cafè del Mar", 15),
      actBescanvi("j2", 5, "Entrada de cinema", 1500),
      actEscaneig("j3", 6, "Llibreria Robafaves", 15),
      actEscaneig("j4", 9, "Peixateria Marina", 20),
    ],
  },
  {
    id: "u-nuria-t",
    poblacioId: "malgrat",
    nom: "Núria T.",
    puntsAcumulats: 450,
    nivell: 2,
    escanejos: 5,
    comercosVisitats: 3,
    bescanvis: 0,
    dataAlta: iso(40),
    ultimaActivitat: iso(3),
    contacteCompartit: true,
    email: "nuria.t@example.cat",
    telefon: "+34 612 000 004",
    activitat: [
      actEscaneig("n1", 3, "Cal Sastre", 25),
      actAccio("n2", 10, "Primer registre a l'app", 100),
    ],
  },
  {
    id: "u-pau-m",
    poblacioId: "malgrat",
    nom: "Pau M.",
    puntsAcumulats: 320,
    nivell: 1,
    escanejos: 3,
    comercosVisitats: 2,
    bescanvis: 0,
    dataAlta: iso(20),
    ultimaActivitat: iso(4),
    contacteCompartit: false,
    activitat: [actAccio("p1", 20, "Primer registre a l'app", 100)],
  },
  {
    id: "u-clara-v",
    poblacioId: "malgrat",
    nom: "Clara V.",
    puntsAcumulats: 1620,
    nivell: 4,
    escanejos: 22,
    comercosVisitats: 8,
    bescanvis: 2,
    dataAlta: iso(180),
    ultimaActivitat: iso(0, 12),
    contacteCompartit: true,
    email: "clara.v@example.cat",
    activitat: [
      actEscaneig("c1", 0, "Forn Rovira", 20),
      actBescanvi("c2", 8, "Gorra KM0 LAB", 600),
      actEscaneig("c3", 15, "Cafè del Mar", 15),
    ],
  },
  {
    id: "u-oriol-b",
    poblacioId: "malgrat",
    nom: "Oriol B.",
    puntsAcumulats: 780,
    nivell: 3,
    escanejos: 9,
    comercosVisitats: 4,
    bescanvis: 0,
    dataAlta: iso(70),
    ultimaActivitat: iso(2),
    contacteCompartit: false,
    activitat: [
      actEscaneig("o1", 2, "Peixateria Marina", 20),
      actAccio("o2", 15, "Inscripció a la Festa Major", 40),
    ],
  },
  {
    id: "u-anna-g",
    poblacioId: "malgrat",
    nom: "Anna G.",
    puntsAcumulats: 3120,
    nivell: 5,
    escanejos: 48,
    comercosVisitats: 10,
    bescanvis: 4,
    dataAlta: iso(300),
    ultimaActivitat: iso(0, 1),
    contacteCompartit: true,
    email: "anna.g@example.cat",
    telefon: "+34 612 000 008",
    activitat: [
      actEscaneig("a1", 0, "Cal Sastre", 25),
      actBescanvi("a2", 4, "Val de 10€", 2000),
      actEscaneig("a3", 6, "Forn Rovira", 20),
      actEscaneig("a4", 10, "Llibreria Robafaves", 15),
    ],
  },
  {
    id: "u-marta-l",
    poblacioId: "malgrat",
    nom: "Marta L.",
    puntsAcumulats: 210,
    nivell: 1,
    escanejos: 2,
    comercosVisitats: 2,
    bescanvis: 0,
    dataAlta: iso(8),
    ultimaActivitat: iso(6),
    contacteCompartit: false,
    activitat: [actAccio("ml1", 8, "Primer registre a l'app", 100)],
  },
];
