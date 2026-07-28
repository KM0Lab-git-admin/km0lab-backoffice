# Knowledge — Backoffice KM0 LAB (rol comerç + rol administrador)

> **Qué es este proyecto**: el **backoffice web de KM0 LAB**. Hoy contiene el panel del
> **comerç** (El meu QR, Promocions, La meva fitxa, Estadístiques). Se va a **ampliar** con
> el rol **ADMINISTRADOR** (gestor de una població) y un shell que se **adapta al rol** del
> usuario autenticado.
>
> **NO es un proyecto nuevo ni una reescritura**: intégrate con lo que ya existe (shell,
> sidebar, i18n, tokens, services, store). Añade; no rehagas.
>
> Idioma de contenido por defecto: **català** (+ es, en). Instrucciones de PO: castellano.

---

## Stack real del proyecto (respétalo tal cual)

- **TanStack Start + TanStack Router** con **routing por fichero** en `src/routes/`
  (`createFileRoute`). Un fichero `x.tsx` es la ruta `/x`; `x.index.tsx` es su índice;
  `x.<segment>.tsx` es `/x/<segment>`. El árbol `src/routeTree.gen.ts` lo **genera el plugin
  automáticamente**: no lo edites a mano.
- **React 19**, **TypeScript** (sin `any`).
- **Tailwind v4** (`@tailwindcss/vite`), tokens en `src/styles.css` (bloque `@theme` + `:root`).
- **shadcn/ui** (estilo "new-york") en `src/components/ui/*` (kebab-case, exports con nombre).
- **Zustand** para estado global (`src/stores/`), **@tanstack/react-query** para datos,
  **react-hook-form + zod** para formularios, **sonner** para toasts, **date-fns** para fechas,
  **lucide-react** para iconos, **framer-motion** para animación.
- Gestor de paquetes **bun**. Build con **vite**.
- Alias `@/` → `src/`. Importa primitivos ui **archivo a archivo** (`@/components/ui/button`).

## Bloque compacto para el campo Knowledge de Lovable (≤10k)

```
Eres el entorno de prototipado del BACKOFFICE de KM0 LAB. Es UN SOLO proyecto
web responsive (desktop + mòbil) que YA tiene el panel del COMERÇ. Se amplía con
el rol ADMINISTRADOR (gestor de una població) y un shell que se adapta al rol del
usuario autenticado. NO creas un proyecto nuevo ni rehaces el shell: intégrate con
lo existente. Reglas completas en docs/KNOWLEDGE.md; tokens en src/styles.css.

Stack (respétalo): TanStack Start + TanStack Router (rutas por fichero en src/routes/,
routeTree.gen.ts autogenerado, NO editar), React 19, Tailwind v4 (tokens en styles.css),
shadcn/ui, Zustand, React Query, react-hook-form + zod, sonner, date-fns, lucide, framer.

Arquitectura de dominio:
- 1 població = 1 administrador + N comerços.
- El usuario de backoffice tiene rol 'admin' o 'comerc'.
- Todo el dato está SCOPED: el admin ve su població; el comerç ve solo su comerç.
- El menú lateral y las rutas se adaptan AUTOMÁTICAMENTE al rol.

Menú por rol:
- admin:  Resum · Accions de punts · Recompenses · Comerços · Usuaris · Configuració
- comerç: Resum · El meu QR · Promocions · La meva fitxa · Estadístiques · Configuració

Reglas críticas (ante conflicto manda docs/KNOWLEDGE.md):
1. Frontera: todo MOCK. Sin auth real, secretos, BD ni escrituras a backend real. Login,
   registro, generación de QR, alta/edición/activación de acciones/promociones/recompensas
   son mock con FIRMA ESTABLE (services async con latencia + store/fixtures). Ante la duda,
   deja la firma mock y avisa en el chat.
2. Rutas por fichero: el rol admin va en src/routes/admin.tsx (layout) + admin.<seg>.tsx;
   páginas en src/pages/ (export default). No edites routeTree.gen.ts.
3. UN solo shell (components/backoffice/AppLayout + AppSidebar). Hazlo ROLE-AWARE: los ítems
   de la sidebar y la identidad salen del rol. No dupliques shell ni sidebar.
4. Estilos: SOLO tokens de styles.css (semánticos: background, foreground, card, primary,
   muted, muted-foreground, accent, destructive, border, sidebar…; y utilidades km0-*:
   bg-km0-blue-700, text-km0-teal-500…). Prohibido hex/rgb e inline estático.
5. Responsive desktop + mòbil (shadcn Sidebar colapsa a drawer en móvil; tablas → tarjetas).
   Valida en 375, 768, 1024, 1280, 1440.
6. Datos vía services tipados (mock). Estado global Zustand; datos con React Query;
   formularios react-hook-form + zod. Toda pantalla: 4 estados (loading/empty/error/feliz)
   + toasts (sonner).
7. Copy SOLO en src/lib/i18n.ts (objeto `messages`, claves "area.element" con {ca,es,en},
   defecto català); consúmelo con useLang()/t(). Añade claves nuevas; nunca strings en JSX.
8. Dependencias: solo las ya presentes en package.json. Otra librería → aprobación humana.
9. Se te ADJUNTAN archivos: mockups HTML (docs/mockups/) y los archivos del proyecto. Los
   HTML son referencia de estructura/comportamiento: NO copies su HTML/CSS ni pixel-perfect;
   reconstruye con el Design System y los componentes existentes.
10. Reutiliza SIEMPRE lo que ya existe (AppLayout, AppSidebar, Card, Table, Switch, Dialog,
    Form, Skeleton, patrón de la pantalla Promocions…). Añade, no rehagas. No rompas el comerç.
```

---

=== KNOWLEDGE ===

## 0. Frontera Lovable ↔ producción

Todo lo que el usuario del backoffice (un comercio o un administrador) experimenta funciona
contra **mocks**. Prueba de fuego: ¿necesita secreto/credencial/BD, escribe datos reales,
autentica de verdad o es lógica de backend? → NO se hace aquí; firma mock + aviso en el chat.

Son **MOCK con firma estable** (producción los implementará sin tocar la UI): login/registro
y **rol**, generación/descarga del **QR**, y **alta/edición/borrado/activación** de
promociones (comerç), **acciones de puntos** y **recompenses** (admin), y todas las
**métricas**. Patrón real de mock en este repo: un `service` async en `src/services/*` con
latencia (`await delay(...)`) que lee/escribe fixtures de `src/data/fixtures/*` o el store
Zustand `src/stores/useBackofficeStore.ts`.

## 1. Arquitectura general

- KM0 LAB tiene la app móvil de vecinos (otro proyecto), **este backoffice web** y los
  backends. Este documento cubre **solo el backoffice**.
- Es una **web responsive desktop + móvil** (no la app móvil): shell con **sidebar** (shadcn
  `Sidebar`, colapsable a drawer en móvil) + área de contenido con ancho máximo.
- **Un solo proyecto, dos roles**: `comerc` y `admin`. La navegación, las rutas y los datos
  se **adaptan al rol** del usuario autenticado.

## 2. Modelo de dominio: població, administrador, comerç

- Una **població** (Malgrat de Mar, Blanes, Lloret de Mar) tiene **1 administrador** y
  **N comerços**.
- El **usuario de backoffice** tiene un **rol** (`admin` | `comerc`), una població y —si es
  comerç— un comerç.
- **Scope de datos**: el `admin` ve/gestiona **toda su població**; el `comerc` **solo su
  comerç**. Nunca datos de otra població.

Tipos sugeridos (amplía `src/types/comerc.ts` o crea `src/types/backoffice.ts`; sin `any`):

```ts
export type Rol = "admin" | "comerc";
export type Poblacio = { id: string; nom: string };          // "Malgrat de Mar"
export type Sessio = { rol: Rol; poblacioId: string; comercId?: string; nom: string };
export type AdminMe = { id: string; poblacioId: string; poblacioNom: string; nom: string };
```

## 3. Roles y permisos

| Ámbito                     | `admin` (gestor població)           | `comerc` (establiment)                 |
| -------------------------- | ----------------------------------- | -------------------------------------- |
| Scope de datos             | Toda su població                    | Solo su comerç                         |
| Accions de punts           | Crear / editar / activar / eliminar | — (sin acceso)                         |
| Recompenses (catàleg)      | Crear / editar / activar / eliminar | — (sin acceso)                         |
| Comerços de la població    | Listar / alta / ver                 | — (solo la seva fitxa)                 |
| Usuaris de la població     | Listar / ver                        | — (sin acceso)                         |
| El meu QR                  | — (no aplica)                       | Ver / descargar / imprimir / regenerar |
| Promocions (informatives)  | — (no aplica)                       | Crear / editar / activar               |
| La meva fitxa              | — (no aplica)                       | Editar la ficha del comercio           |
| Estadístiques              | (de la població — futuro)           | Del seu comerç                         |
| Configuració               | De la població                      | Del seu comerç                         |

El rol vive en un **store de sesión** (Zustand). Las rutas están **guardadas por rol**:
`/comerc/*` solo `comerc`; `/admin/*` solo `admin`. Acceder a una ruta ajena redirige a la
home del propio rol.

## 4. Menú lateral por rol

El **shell es único** (`AppLayout` + `AppSidebar`). La sidebar renderiza sus ítems según el
rol del usuario autenticado:

- **admin**: `Resum` (`/admin/resum`) · `Accions de punts` (`/admin/accions`) · `Recompenses`
  (`/admin/recompenses`) · `Comerços` (`/admin/comercos`) · `Usuaris` (`/admin/usuaris`) ·
  `Configuració` (`/admin/configuracio`).
- **comerc** (ya existente): `Resum` · `El meu QR` (`/comerc/el-meu-qr`) · `Promocions` ·
  `La meva fitxa` · `Estadístiques` · `Configuració`.

La identidad de la sidebar (bloque `who`) muestra: admin → nombre de la població + «Entitat
gestora»; comerç → nombre del comercio + «Comerç adherit» (ya implementado con `ComercMe`).

## 5. Reglas de negocio

- **1 admin por població**; **N comerços** por població. (La unicidad del admin se valida en
  producción; en el mock solo se representa.)
- Al **registrarse**, el usuario elige rol (`admin` o `comerc`) y població. Todo lo que ve
  después está **scoped** a esa població (y, si es comerç, a su comerç).
- **Puntos por escaneo del QR**: cada comercio tiene un QR único físico; el vecino gana
  puntos fijos **una sola vez por comercio**. El **admin** define además **acciones que
  otorgan puntos extra** (primer registre a l'app, primer escaneig d'un comerç, visitar una
  web, registrar-se en una web, inscripció a un esdeveniment…). Estas acciones **se suman** a
  los puntos del QR (escanear = puntos del QR + bonificación de "primer escaneig").
- Cada **acción** define al menos: nom, descripció, punts, condicions, període de validesa y
  límit d'usos; y **campos específicos según el tipo** (URL, esdeveniment, comerç…).
- **Promocions** (rol comerç) son **solo informativas** (sin código/validación/canje); **no
  son recompenses**.
- **Recompenses** (rol admin) son el catálogo canjeable **por puntos** (p. ej. 1.000 pts →
  val de 5€, descomptes, entrades, experiències, marxandatge). El canje lo hace el vecino en
  la sección Recompenses de la **app** (fuera del backoffice); aquí el admin **solo administra
  el catálogo**. Cada recompensa define: nom, descripció, imatge, tipus, punts necessaris,
  valor/import, comerços on usar-la, estoc (si aplica), dates i condicions, y **estat**:
  `activa` | `inactiva` | `esgotada`.

## 6. Estructura de carpetas y routing (contrato)

Trabaja SOLO dentro de `src/`. Estructura ya establecida:

```
src/
├── routes/          # rutas por fichero (TanStack Router). NO editar routeTree.gen.ts
│   ├── comerc.tsx   # layout del comerç (envuelve con AppLayout)
│   ├── comerc.<seg>.tsx
│   └── admin.tsx …  # ← NUEVO: layout del admin + admin.<seg>.tsx
├── pages/           # componentes de pantalla (export default) que las rutas importan
├── components/
│   ├── backoffice/  # shell y componentes de dominio (AppLayout, AppSidebar, *Form, *List…)
│   └── ui/          # primitivos shadcn (kebab-case)
├── hooks/           # use-*.ts(x)
├── services/        # capa de datos mock (async + latencia)
├── data/fixtures/   # datos mock
├── stores/          # Zustand
├── contexts/        # LangContext
├── types/           # tipos de dominio
├── lib/i18n.ts      # copy (objeto messages, ca/es/en)
├── lib/utils.ts     # solo cn()
└── styles.css       # Tailwind v4 + tokens KM0
```

Convenciones de nombres: pantallas/páginas y componentes `PascalCase` (export default);
primitivos `components/ui/` en `kebab-case`; services/stores/data `camelCase.ts`; rutas
`kebab-case`. Un fichero de ruta importa su página: p. ej.
`admin.accions.tsx` → `import Accions from "@/pages/Accions"`.

## 7. Estructura visual y componentes existentes

- **Tokens** (src/styles.css): usa SOLO tokens. Semánticos (mapean la paleta KM0):
  `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `muted-foreground`,
  `accent`, `destructive`, `border`, `input`, `ring`, `sidebar*`. Utilidades de marca:
  `km0-beige-50/100/200`, `km0-blue-50/400/500/700/800`, `km0-yellow-300/400`,
  `km0-teal-400/500`, `km0-coral-400/500`, `km0-green-500` (como clases: `bg-km0-blue-700`,
  `text-km0-teal-500`). Prohibido hex/rgb crudos e inline estático.
- **Shell** (reutilízalo, hazlo role-aware): `src/components/backoffice/AppLayout.tsx`
  (`SidebarProvider` + sidebar + header con `SidebarTrigger` y `LangSwitcher` +
  `main` con `max-w-6xl`) y `src/components/backoffice/AppSidebar.tsx` (shadcn `Sidebar`
  `collapsible="icon"`, `navItems` como array de `{ to, labelKey, icon }`). Hoy `AppLayout`
  hace `comercService.getMe()` y pinta la sidebar del comerç; hay que ramificar por rol.
- **Primitivos y patrones a reutilizar**: `card`, `table`, `switch`, `dialog`,
  `alert-dialog` (confirmar borrado), `form` + `input` + `label` + `textarea` + `select`,
  `tabs`, `badge`, `skeleton`, `sonner` (toasts), `calendar`/`react-day-picker` (fechas),
  `sidebar`, `sheet`/`drawer` (móvil). **No crees primitivos nuevos si ya hay equivalente.**
- **Patrón de referencia para listado + alta/edición**: la pantalla del comerç `Promocions`
  (`src/pages/Promocions.tsx` con `PromocioList` + `PromocioForm`, toggles, confirmació
  d'esborrat i toasts). Las pantallas del admin (Accions, Recompenses) siguen ESE mismo
  patrón.

## 8. Convenciones técnicas

- **Presentación/lógica**: pantallas presentacionales; todo dato vía `services/` (async,
  latencia 300–800 ms, firma = contrato). Estado local `useState`; global Zustand (incluye el
  **rol/sesión**); datos con `@tanstack/react-query`. Estado de pantalla como unión
  discriminada; **4 estados** siempre. Formularios react-hook-form + zod con estados de
  guardado (mock) y toasts (`sonner`, ya montado en `__root.tsx`).
- **i18n** (`src/lib/i18n.ts`): el copy vive en el objeto `messages` (typed
  `satisfies Record<string, Dict>`, `Dict = Record<'ca'|'es'|'en', string>`), claves
  `"area.element"`, defecto **català**. Consúmelo con `useLang()` → `t("clau")`. **Añade
  claves nuevas al objeto `messages`** (así `MessageKey` las reconoce); nunca strings en JSX.
  Nombres propios y valores son datos, no copy.
- **Imports** con alias `@/`; primitivos ui archivo a archivo; sin barrels ni relativos
  profundos. Sin código muerto, `console.log` ni TODOs sin contexto.
- **Dependencias**: usa solo las ya presentes en `package.json`. Cualquier otra requiere
  aprobación humana en el chat.
- **Intocables**: `src/lib/utils.ts`, `src/routeTree.gen.ts` (autogenerado), la API de los
  primitivos `components/ui/` existentes, `vite.config.ts`, alias `@/`, y los tokens ya
  definidos de `styles.css` (añadir token nuevo sí; renombrar/borrar no).

## 9. Integración de las nuevas pantallas con las existentes

- **Amplía, no rehagas.** Las pantallas del comerç ya existen; las del admin son **rutas y
  páginas nuevas** en el MISMO proyecto.
- **Un solo shell role-aware**: modifica `AppLayout`/`AppSidebar` para que la navegación y la
  identidad salgan del **rol** (store de sesión). No crees un segundo shell ni una segunda
  sidebar.
- **Routing**: añade `src/routes/admin.tsx` (layout con `AppLayout` + `<Outlet/>`, igual que
  `comerc.tsx`), `admin.index.tsx` (redirect a `/admin/resum`) y `admin.<seg>.tsx` para resum,
  accions, recompenses, comercos, usuaris, configuracio. Guarda las rutas por rol.
- **Sesión/rol en el store**: crea `src/stores/useSessionStore.ts` (o similar) con `rol`,
  `poblacioId`, `comercId?`. Provee un mock y un conmutador de rol de desarrollo para
  previsualizar ambos roles.
- **Reutiliza** services, tipos, i18n y primitivos. Extiende `types/` y `services/` con las
  entidades nuevas (accions, recompenses) sin romper las existentes.
- **No rompas** ninguna pantalla del comerç ni cambies la API de los primitivos.

## 10. Ejemplos en HTML como referencia

Se te adjuntan maquetas en `docs/mockups/` (`gestor-mockup.html` = pantallas del admin;
`comercos-mockup.html` = la sección de comercios de la app + el backoffice del comerç). Son
referencia de **estructura, jerarquía y comportamiento**: **no** copies su HTML/CSS ni las
reproduzcas pixel-perfect; reconstruye con los componentes React del proyecto y el Design
System, aplicando el layout responsive.

## 11. Modo no técnico (Product Owner / diseño)

Ante un prompt no técnico: identifica el componente y dilo; reformula el cambio en UNA frase
no técnica y espera confirmación; toca solo el elemento señalado; aplica estas reglas sin que
te las pidan; si exige una decisión técnica (dependencia nueva, tocar un intocable, conectar
datos reales), no lo hagas y derívalo al desarrollador.

## 12. Checklist antes de dar una pantalla por terminada

- [ ] Se ve correcta en **375, 768, 1024, 1280 y 1440** (móvil → desktop).
- [ ] Sidebar y rutas correctas **según el rol**; sin romper el otro rol.
- [ ] Sidebar → drawer en móvil; tablas → tarjetas en móvil.
- [ ] 4 estados (loading / empty / error / feliz) + toasts.
- [ ] Formularios con react-hook-form + zod y estados de guardado (mock).
- [ ] Copy en `src/lib/i18n.ts` (objeto `messages`, ca/es/en, defecto català); sin strings en JSX.
- [ ] Datos vía service tipado (mock, firma estable), scoped al rol/població.
- [ ] Solo tokens de `styles.css`; cero hex, cero inline estático.
- [ ] Imports con `@/`, primitivos ui archivo a archivo; reutiliza lo existente.
- [ ] No editaste `routeTree.gen.ts` a mano; sin deps nuevas; sin duplicar shell/sidebar.
