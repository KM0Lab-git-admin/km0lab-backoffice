import type {
  AccioTop,
  AdminMe,
  AdminResumStats,
  BescanviResum,
  Poblacio,
} from "@/types/backoffice";

export const poblacionsFixture: Poblacio[] = [
  { id: "malgrat", nom: "Malgrat de Mar" },
  { id: "blanes", nom: "Blanes" },
  { id: "lloret", nom: "Lloret de Mar" },
];

export const adminMeFixture: AdminMe = {
  id: "admin-malgrat",
  poblacioId: "malgrat",
  poblacioNom: "Baix Montseny",
  nom: "Consell del Baix Montseny",
  poblacions: [
    { id: "breda", nom: "Breda" },
    { id: "hostalric", nom: "Hostalric" },
    { id: "riells", nom: "Riells i Viabrea" },
  ],
};

export const adminResumStatsFixture: AdminResumStats = {
  usuarisActius: 1240,
  puntsCirculacio: 84500,
  bescanvisMes: 312,
  accionsActives: 18,
  accionsTotals: 24,
};

export const accionsTopFixture: AccioTop[] = [
  {
    id: "a1",
    nom: "Primer registre a l'app",
    tipus: "registre",
    punts: 100,
    usos: 640,
    emoji: "⚡",
  },
  {
    id: "a2",
    nom: "Primer escaneig d'un comerç",
    tipus: "escaneig",
    punts: 50,
    usos: 512,
    emoji: "🏪",
  },
  {
    id: "a3",
    nom: "Visita la web de turisme",
    tipus: "web",
    punts: 20,
    usos: 210,
    emoji: "🌐",
  },
  {
    id: "a4",
    nom: "Inscripció a la Festa Major",
    tipus: "esdeveniment",
    punts: 40,
    usos: 98,
    emoji: "🎟️",
  },
];

export const ultimsBescanvisFixture: BescanviResum[] = [
  { id: "b1", recompensaNom: "Val de 5€", usuari: "Marc P.", quan: "fa 2 h", punts: 1000, emoji: "🎫" },
  { id: "b2", recompensaNom: "Entrada de cinema", usuari: "Laia R.", quan: "fa 5 h", punts: 1500, emoji: "🎬" },
  { id: "b3", recompensaNom: "Gorra KM0 LAB", usuari: "Joan S.", quan: "ahir", punts: 600, emoji: "🧢" },
  { id: "b4", recompensaNom: "Val de 10€", usuari: "Núria T.", quan: "ahir", punts: 2000, emoji: "🎫" },
];
