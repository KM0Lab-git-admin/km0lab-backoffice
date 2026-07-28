# Prompt Lovable · 06 · Administrador · Bescanvis (seguiment de premis bescanviats)

> Pantalla del rol ADMIN para consultar y gestionar los canjes de recompensas hechos por los
> veïns. Requiere la base del prompt 00 (roles + shell) y el catálogo del prompt 02
> (Recompenses). Instrucciones en castellano; UI strings en catalán + ES/EN vía i18n.
>
> ▸ ADJUNTA A LOVABLE: `docs/KNOWLEDGE.md` y los archivos del proyecto.
> ▸ SIN MOCKUP: no hay maqueta específica; mantén la coherencia visual con el resto del
> backoffice (mismos componentes/tokens). Inspiración de tabla/filtros: la pantalla
> Estadístiques del comerç.

---

```
AMPLÍA este proyecto de backoffice de KM0 LAB con una NUEVA pantalla del rol ADMIN:
"Bescanvis" — el seguimiento de todos los premios (recompenses) que los veïns han canjeado.
Intégrate con el shell y los roles ya definidos (prompt 00): rol 'admin', ruta /admin/bescanvis.

▸ CONTEXTO IMPORTANTE
Solo visible para 'admin', dentro del shell y la sidebar ya existentes. AÑADE una nueva entrada
"Bescanvis" a la sidebar del admin (no dupliques el shell). Respeta el stack real (TanStack
Router por fichero — no edites routeTree.gen.ts; Tailwind v4 con tokens de styles.css; shadcn;
Zustand; React Query; i18n en el objeto `messages`, defecto català). Reconstruye con el Design
System y REUTILIZANDO los componentes existentes (Table, Card, Badge, Select, Input de cerca,
Dialog/Sheet, calendar/react-day-picker, alert-dialog, Skeleton). Responsive: tabla en desktop,
tarjetas en móvil.

▸ QUÉ ES
El catálogo de recompenses (prompt 02) define los premios disponibles; esta pantalla muestra
los CANJES ya realizados por los veïns. El admin CONSULTA y GESTIONA EL ESTADO de cada canje.
Los canjes los crean los usuarios en la app: aquí NO se crean, solo se consultan y se actualiza
su estado. Enlaza con el panel "Últims bescanvis" del Resum.

▸ DOS FLUJOS SEGÚN EL TIPO DE PREMIO (deriva del tipus de la recompensa)
1) VAL AMB QR — tipus 'saldo' y 'descompte'.
   Al canjear, la app genera un QR que acredita el derecho a usarlo. Cuando el COMERÇ escanea
   el QR, el val queda UTILITZAT y el descuento aplicado. Estados: 'pendent_us' (QR generat,
   sense escanejar) → 'utilitzat' (escanejat pel comerç). Además 'cancel·lat'.
   El admin NO marca "utilitzat" a mano (lo hace el escaneo del comercio — mock automático);
   sí puede CANCEL·LAR.
2) LLIURAMENT FÍSIC — tipus 'producte', 'marxandatge', 'experiencia' (entrades) y 'servei'.
   Seguimiento de entrega con estados: 'solicitat' → 'pendent_preparacio' → 'preparat' →
   'pendent_recollida' → 'entregat'. Además 'cancel·lat'. El admin actualiza el estado
   MANUALMENTE y puede cancelar.

▸ RUTA Y PÁGINA
- Ruta: src/routes/admin.bescanvis.tsx → import Bescanvis from "@/pages/Bescanvis".
- Añade el ítem a la sidebar del admin (p. ej. entre "Recompenses" y "Comerços"), icono lucide
  Ticket o ReceiptText, labelKey nav.bescanvis. Detalle con Dialog/Sheet o ruta de detalle.

▸ PANTALLA A · LLISTAT (/admin/bescanvis)
- Cabecera: título "Bescanvis" + guía "Seguiment de tots els premis bescanviats pels veïns de
  {població}."
- (Opcional) fila breve de KPIs: total de bescanvis, pendents (d'ús o de lliurament),
  completats aquest mes.
- FILTROS (barra reutilizando Input/Select/calendar): cerca per usuari; Select tipus de premi;
  Select estat; Select comerç; rang de dates (data de solicitud). Botó per netejar filtres.
- Lista (Table en desktop, tarjetas en móvil). Columnas: Usuari, Premi (+ badge de tipus),
  Punts descomptats, Data de solicitud, Estat (badge; color según flujo/estado), Comerç (si
  aplica), Data d'ús/lliurament. Fila clicable → detalle.
- Mock inicial (mín. 8, variado): p. ej.
  · "Val de 10€" (saldo, val_qr) · Marc P. · −2.000 pts · pendent_us · QR generat · sense comerç
  · "Val de 5€" (saldo, val_qr) · Laia R. · −1.000 pts · utilitzat · Forn Rovira · escaneig amb
    data/hora · import aplicat 5€
  · "10% llibreria" (descompte, val_qr) · Joan S. · −500 pts · utilitzat · Llibreria Robafaves
  · "Entrada de cinema" (experiencia, lliurament) · Núria T. · −1.500 pts · preparat
  · "Gorra KM0 LAB" (marxandatge, lliurament) · Pau G. · −600 pts · entregat
  · "Samarreta KM0 LAB" (marxandatge, lliurament) · Aina F. · −800 pts · pendent_preparacio
  · un 'cancel·lat' i un 'pendent_recollida' més.
- Estados de pantalla: loading (Skeleton de filas), empty ("Encara no hi ha bescanvis" o "Cap
  resultat amb aquests filtres" + acció netejar filtres), error (Try again).

▸ PANTALLA B · DETALL D'UN BESCANVI
- Común: usuari, premi (+tipus), punts descomptats, data de solicitud, estat actual, i
  HISTORIAL de canvis d'estat (data + estat + nota opcional).
- Si val_qr: import del val, QR generat sí/no (mostra un QR mock si generat), pendent/utilitzat,
  comerç que ha escanejat, data i hora de l'escaneig, import aplicat. Acció "Cancel·lar val"
  (alert-dialog).
- Si lliurament: control per AVANÇAR l'estat (Solicitat → … → Entregat) amb camp nota opcional,
  i acció "Cancel·lar" (alert-dialog). En passar a "entregat", registra la data de lliurament.
- Toast en cada canvi d'estat / cancel·lació.

▸ DATOS (MOCK — frontera: todo mockeado; scoped a la població del admin)
Reutiliza RecompensaTipus (prompt 02). Define tipos y service (patrón services existentes:
async + delay + store/fixtures):

  type BescanviFlux = 'val_qr' | 'lliurament';
  type BescanviEstat =
    | 'pendent_us' | 'utilitzat'                                   // val_qr
    | 'solicitat' | 'pendent_preparacio' | 'preparat'
    | 'pendent_recollida' | 'entregat'                            // lliurament
    | 'cancel·lat';                                                // comú
  type BescanviHist = { estat: BescanviEstat; data: string; nota?: string };
  type Bescanvi = {
    id: string; poblacioId: string;
    usuariId: string; usuariNom: string;
    recompensaId: string; recompensaNom: string; recompensaTipus: RecompensaTipus;
    flux: BescanviFlux;                 // derivat del tipus: saldo|descompte → val_qr; resta → lliurament
    puntsDescomptats: number;
    dataSolicitud: string;              // ISO
    estat: BescanviEstat;
    // val_qr:
    import?: string; qrGenerat?: boolean;
    comercId?: string; comercNom?: string; dataUs?: string; importAplicat?: string;
    // lliurament:
    dataLliurament?: string;
    historial?: BescanviHist[];
  };
  // src/services/bescanvisService.ts:
  //   list(poblacioId, filtres?) / get(id) / updateEstat(id, estat, nota?) / cancel(id)
  // estado en un store Zustand + fixture inicial. Deriva `flux` del `recompensaTipus`.

▸ i18n
Añade las claves nuevas al objeto `messages` de src/lib/i18n.ts ({ ca, es, en }, defecto
català): nav.bescanvis, títulos, filtros, nombres de estado (un rótulo por BescanviEstat) y
toasts. Consúmelas con t(). Nombres, importes y fechas son datos. Nada hardcoded en JSX.

▸ QUÉ NO HACER AHORA
- No crees bescanvis aquí (los crea el usuario en la app); esta pantalla es consulta + gestión
  de estado.
- No conectes a backend ni base de datos: listar, actualizar estado y cancelar son mock (firma
  estable). El QR y el escaneo del comercio son mock (no generes QR real ni cámara).
- No permitas marcar "utilitzat" a mano en los vales (eso lo hace el escaneo del comercio,
  simulado); el admin sí puede cancelar.
- Solo visible para 'admin'; no toques las pantallas ni la sidebar del comerç. No dupliques el
  shell. No edites routeTree.gen.ts a mano. No añadas dependencias fuera de package.json.

Objetivo: dentro del backoffice existente, el admin hace seguimiento de todos los premios
canjeados (llistat con filtros por usuari/tipus/estat/comerç/dates + detall), con los dos
flujos (val amb QR: pendent/utilitzat + comerç + escaneig; lliurament físic: solicitat→…→
entregat con actualización manual de estado e historial), reutilizando los componentes del
proyecto, con 4 estados y responsive. Todo mock, scoped a su població.
```
