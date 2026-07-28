# Prompt Lovable · 03 · Administrador · Comerços

> Pantalla del rol ADMIN para gestionar los comercios de su població: llistat + alta/invitació
> + detall. Requiere la base del prompt 00 (roles + shell). Instrucciones en castellano; UI
> strings en catalán + ES/EN vía i18n.
>
> ▸ ADJUNTA A LOVABLE: `docs/KNOWLEDGE.md` y los archivos del proyecto.
> ▸ SIN MOCKUP: no hay maqueta específica; mantén la coherencia visual con el resto del
> backoffice (mismos componentes/tokens) y con `docs/mockups/gestor-mockup.html`.

---

```
AMPLÍA este proyecto de backoffice de KM0 LAB con la pantalla del rol ADMIN "Comerços".
Intégrate con el shell y los roles ya definidos (prompt 00): rol 'admin', ruta /admin/comercos.

▸ CONTEXTO IMPORTANTE
Solo visible para 'admin', dentro del shell y la sidebar ya existentes (ítem "Comerços").
Respeta el stack real (TanStack Router por fichero — no edites routeTree.gen.ts; Tailwind v4
con tokens de styles.css; shadcn; Zustand; React Query; react-hook-form + zod; i18n en el
objeto `messages`, defecto català). Reconstruye con el Design System y REUTILIZANDO los
componentes existentes. SIGUE EL MISMO PATRÓN que la pantalla del comerç "Promocions"
(llistat + alta/edición con Dialog/Sheet, toggles, confirmació d'esborrat, toasts). Responsive:
tabla en desktop, tarjetas en móvil.

▸ QUÉ ES
El administrador ve y gestiona los comercios de SU població (1 població = N comerços). Puede
listar, ver el detalle, y dar de alta / invitar nuevos comercios. El comercio invitado luego
accede con rol 'comerc' (eso es producción; aquí el alta es mock).

▸ RUTA Y PÁGINA
- Ruta: src/routes/admin.comercos.tsx → import Comercos from "@/pages/Comercos" (sustituye el
  placeholder del prompt 00). Alta/edición y detalle con Dialog/Sheet o rutas de detalle.

▸ PANTALLA A · LLISTAT (/admin/comercos)
- Cabecera: título "Comerços" + guía "Els comerços adherits de {població}." + botón "Afegir
  comerç".
- Lista (Table en desktop, tarjetas en móvil). Cada fila: logo/emoji + nom, categoria(es),
  badge d'ESTAT (Actiu / Pendent d'accés / Inactiu), QR (generat sí/no), nº de promocions
  actives, punts per visita, data d'alta, y acciones veure / editar / (des)activar.
- Buscador por nombre + filtro por estat (opcional, reutiliza Input/Select).
- Mock inicial (mín. 6): Forn Rovira (Alimentació·Fleca, actiu, QR sí, 3 promos, +20, alta
  fa mesos); Cafè del Mar (Restauració, actiu, +15); Cal Sastre (Moda, actiu, +25);
  Floristeria Nom (Serveis, pendent d'accés, QR sí, 0 promos, +20); Peixateria Marina
  (Alimentació, actiu, +20); Llibreria Robafaves (Cultura, inactiu, +15).
- Estados: loading (Skeleton), empty ("Encara no hi ha comerços" + CTA "Afegir el primer
  comerç"), error (Try again). Toast al crear / (des)activar.

▸ PANTALLA B · ALTA / INVITACIÓ (i editar)
Formulario (react-hook-form + zod; guardado mock + toast "Comerç convidat" / "Comerç desat"):
- Nom del comerç.
- Categoria(es) (text separado por comas o Select múltiple).
- Email de contacte (per enviar la invitació — mock).
- Punts per visita del seu QR (número).
- Adreça (opcional).
Al crear: estat inicial "Pendent d'accés", es genera el QR automàticament (mock) i s'"envia"
la invitació (mock, sense backend). En editar un comerç existent, es poden canviar aquestes
dades.

▸ PANTALLA C · DETALL (opcional, read-only per l'admin)
Resum d'un comerç: dades, estat del QR, nº de promocions actives i mètriques bàsiques
(visites, punts atorgats). Enllaç per (des)activar. Tot mock i read-only.

▸ DATOS (MOCK — frontera: todo mockeado; scoped a la població del admin)
Define tipos y service (mismo patrón que los services existentes: async + delay + store/fixtures):

  type ComercEstat = 'actiu' | 'pendent' | 'inactiu'
  type ComercAdmin = {
    id: string; poblacioId: string
    nom: string; emoji?: string; logoUrl?: string
    categories: string[]
    emailContacte: string
    puntsPerVisita: number
    adreca?: string
    estat: ComercEstat
    qrGenerat: boolean
    nPromocionsActives: number
    dataAlta: string          // ISO
  }
  // src/services/adminComercosService.ts: list(poblacioId) / get / create (invita) / update / toggle
  // estado en un store Zustand + fixture inicial. NO lo confundas con comercService.getMe()
  // (ese es el propio comercio del rol comerç).

▸ i18n
Añade las claves nuevas al objeto `messages` de src/lib/i18n.ts ({ ca, es, en }, defecto
català) y consúmelas con t(). Nombres, categorías y valores son datos. Nada hardcoded en JSX.

▸ QUÉ NO HACER AHORA
- No implementes el envío real de invitaciones, alta real ni backend: todo mock (firma estable).
- No generes el QR contra un backend: el "QR generat" es un flag mock.
- Solo visible para 'admin'; no toques las pantallas ni la sidebar del comerç.
- No dupliques el shell/sidebar; no edites routeTree.gen.ts a mano; no añadas dependencias
  fuera de package.json.

Objetivo: dentro del backoffice existente, el admin gestiona los comercios de su població
(llistat + alta/invitació + detall), reutilizando los componentes y el patrón de Promocions,
con sus 4 estados y responsive. Todo mock, scoped a su població.
```
