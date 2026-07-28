# Prompt Lovable · 01 · Administrador · Accions de punts

> Pantallas del rol ADMIN para gestionar las acciones que otorgan puntos: llistat +
> alta/edición. Requiere la base del prompt 00 (roles + shell). Instrucciones en castellano;
> UI strings en catalán + ES/EN vía i18n.
>
> ▸ ADJUNTA A LOVABLE: `docs/KNOWLEDGE.md`, `docs/mockups/gestor-mockup.html` (bloques
> "Accions de punts — llistat" y "nova/editar") y los archivos del proyecto.

---

```
AMPLÍA este proyecto de backoffice de KM0 LAB con las pantallas del rol ADMIN para "Accions
de punts": el LLISTAT y el formulario de ALTA/EDICIÓ. Intégrate con el shell y los roles ya
definidos (prompt 00): rol 'admin', rutas /admin/*.

▸ CONTEXTO IMPORTANTE
Solo visible para 'admin', dentro del shell y la sidebar ya existentes (ítem "Accions de
punts"). Respeta el stack real (TanStack Router por fichero — no edites routeTree.gen.ts;
Tailwind v4 con tokens de styles.css; shadcn; Zustand; React Query; react-hook-form + zod;
i18n en el objeto `messages`). La maqueta adjunta es referencia: NO copies su HTML/CSS ni
pixel-perfect; reconstruye con el Design System y REUTILIZANDO los componentes existentes.
SIGUE EL MISMO PATRÓN que la pantalla del comerç "Promocions" (src/pages/Promocions.tsx con
PromocioList + PromocioForm, toggles, confirmació d'esborrat amb alert-dialog i toasts).
Layout responsive: tabla en desktop, tarjetas en móvil.

▸ QUÉ SON ESTAS ACCIONES
El administrador de la població configura acciones por las que los veïns ganan puntos EXTRA,
que SE SUMAN a los puntos del QR del comercio (escanear = puntos del QR + bonificación de
"primer escaneig"). Puntos y promociones son cosas distintas.

▸ RUTA Y PÁGINA
- Ruta: src/routes/admin.accions.tsx → import Accions from "@/pages/Accions".
- (Opcional) rutas de detalle admin.accions.nova.tsx / admin.accions.$id.tsx, o resuelve el
  alta/edición con un Dialog/Sheet dentro de la misma página (como haga Promocions).

▸ PANTALLA A · LLISTAT (/admin/accions)
- Cabecera: título "Accions de punts" + guía "Configura per què guanyen punts els veïns a
  {població}." + botón "Afegir acció".
- Lista (Table en desktop, tarjetas en móvil). Cada fila: icono del tipo, nom + detalle
  (condicions/validesa), badge de TIPUS, badge de PUNTS ("+100 pts"), Switch activa/inactiva,
  y acciones editar / eliminar (eliminar con alert-dialog de confirmación). Inactivas atenuadas.
- Mock inicial (mín. 6): "Primer registre a l'app" (registre, +100, un cop/usuari, activa);
  "Primer escaneig d'un comerç" (escaneig_qr, +50, bonificació, activa); "Visita la web de
  turisme" (visita_web, +20, límit 1/usuari, activa); "Registre al butlletí municipal"
  (registre_web, +30, activa); "Inscripció a la Festa Major" (esdeveniment, +40, vigència
  01/06–31/07, activa); "Enquesta de satisfacció" (visita_web, +15, DESACTIVADA).
- Estados: loading (Skeleton de filas), empty ("Encara no hi ha accions" + CTA "Afegir la
  primera acció"), error (Try again). Toast al activar/desactivar/eliminar (sonner).

▸ PANTALLA B · NOVA / EDITAR ACCIÓ
- Selector de TIPUS (lista predefinida, tarjetas o segmented):
  · registre — Primer registre a l'app (sin campos extra)
  · escaneig_qr — Primer escaneig d'un comerç (campo: "qualsevol comerç" o un comerç concret
    → Select de comerços de la població)
  · visita_web — Visita web (campo: URL de destí; opción: requerir uns segons)
  · registre_web — Registre web (campo: URL)
  · esdeveniment — Inscripció a esdeveniment (campo: Select d'esdeveniment)
  · personalitzada — Altres condicions (campo: descripció de la condició)
- Al cambiar el tipo, muestra los CAMPOS ESPECÍFICOS de ese tipo. Campos COMUNES a todas:
  nom, descripció (textarea), punts atorgats (número), límit d'usos per usuari + límit total
  (opcional), vàlida des de / fins (opcional, date-fns), condicions (lletra petita), Switch
  "Acció activa i visible per als veïns", botón "Desar acció".
- Validación react-hook-form + zod; errores por campo; guardado MOCK (añade/edita en el
  store/service, sin backend); toast "Acció desada".

▸ DATOS (MOCK — frontera: todo mockeado; scoped a la població del admin)
Define tipos y service (mismo patrón que promocionsService: async + delay + store/fixtures):

  type AccioTipus = 'registre' | 'escaneig_qr' | 'visita_web' | 'registre_web'
                  | 'esdeveniment' | 'personalitzada'
  type AccioPunts = {
    id: string; poblacioId: string; tipus: AccioTipus
    nom: string; descripcio: string; punts: number
    limitPerUsuari?: number; limitTotal?: number
    vigenciaInici?: string; vigenciaFi?: string
    condicions?: string; activa: boolean
    url?: string; esdevenimentId?: string; comercId?: string  // camps específics per tipus
  }
  // src/services/accionsService.ts: list / get / create / update / toggle / remove
  // estado en un store Zustand (nuevo o extendiendo useBackofficeStore) + fixture inicial

▸ i18n
Añade las claves nuevas al objeto `messages` de src/lib/i18n.ts ({ ca, es, en }, defecto
català) y consúmelas con t(). Nombres, URLs y valores son datos. Nada hardcoded en JSX.

▸ QUÉ NO HACER AHORA
- No implementes la validación real de las acciones ni backend: alta/edición/toggle mutan solo
  el mock (firma estable). La lógica de otorgar puntos es producción/app.
- Solo visible para 'admin'; no toques las pantallas ni la sidebar del comerç.
- No dupliques el shell/sidebar (usa el existente, ítem "Accions de punts" activo).
- No edites routeTree.gen.ts a mano; no añadas dependencias fuera de package.json.

Objetivo: dentro del backoffice existente, el admin gestiona las acciones de puntos (llistat +
alta/edición con tipo predefinido y campos por tipo), reutilizando los componentes y el patrón
de Promocions, con sus 4 estados y responsive. Todo mock, scoped a su població.
```
