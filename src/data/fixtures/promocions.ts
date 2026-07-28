import type {
  ComercFitxa,
  ComercMe,
  ComercQR,
  Promocio,
  QRMetrics,
} from "@/types/comerc";

export const comercMeFixture: ComercMe = {
  id: "km0-mlg-00427",
  nom: "Forn Rovira",
  emoji: "🥐",
  adherit: true,
};

export const comercQRFixture: ComercQR = {
  comercId: comercMeFixture.id,
  codi: "KM0-MLG-00427",
  puntsPerVisita: 20,
  pngUrl: "/mock/qr-forn-rovira.png",
  pdfUrl: "/mock/qr-forn-rovira.pdf",
};

export const qrMetricsFixture: QRMetrics = {
  visites: 128,
  puntsAtorgats: 2560,
  nousVisitantsSetmana: 14,
};

export const comercFitxaFixture: ComercFitxa = {
  id: comercMeFixture.id,
  nom: "Forn Rovira",
  categories: ["Alimentació", "Fleca"],
  descripcio:
    "Forn artesà de tota la vida al centre de Malgrat. Pa de massa mare, coques i brioixeria feta cada matí.",
  logoUrl: undefined,
  heroUrl: undefined,
  adreca: "Carrer de Mar, 14",
  codiPostal: "08380",
  poblacio: "Malgrat de Mar",
  telefon: "93 765 00 00",
  web: "fornrovira.cat",
  horari: {
    dilluns: { tancat: false, obertura: "07:00", tancament: "20:00" },
    dimarts: { tancat: false, obertura: "07:00", tancament: "20:00" },
    dimecres: { tancat: false, obertura: "07:00", tancament: "20:00" },
    dijous: { tancat: false, obertura: "07:00", tancament: "20:00" },
    divendres: { tancat: false, obertura: "07:00", tancament: "20:00" },
    dissabte: { tancat: false, obertura: "08:00", tancament: "14:00" },
    diumenge: { tancat: true, obertura: "09:00", tancament: "13:00" },
  },
};

export const promocionsFixture: Promocio[] = [
  {
    id: "p-1",
    tipus: "descompte",
    etiqueta: "-5%",
    titol: "5% de descompte",
    detall: "En pa i brioixeria",
    valor: "5%",
    condicio: "No acumulable amb altres ofertes",
    activa: true,
  },
  {
    id: "p-2",
    tipus: "dos_x_un",
    etiqueta: "2×1",
    titol: "2×1 en cafès",
    detall: "De dilluns a divendres, matins",
    activa: true,
  },
  {
    id: "p-3",
    tipus: "descompte",
    etiqueta: "-15%",
    titol: "15% de descompte",
    detall: "Per compres superiors a 20€",
    valor: "15%",
    compraMinima: "20€",
    activa: true,
  },
  {
    id: "p-4",
    tipus: "regal",
    etiqueta: "Regal",
    titol: "Croissant de regal",
    detall: "Amb la teva primera visita",
    activa: false,
  },
];
