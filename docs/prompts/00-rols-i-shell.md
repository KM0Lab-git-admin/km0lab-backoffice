# Prompt Lovable · 00 · Roles + shell adaptable (base de integración)

> BASE del backoffice del administrador: introduce el rol (comerç / admin), la sesión mock,
> el shell adaptable al rol y el "Resum" del admin. Se ejecuta sobre ESTE proyecto (ya tiene
> el panel del comerç). Instrucciones en castellano; UI strings en catalán + ES/EN vía i18n.
>
> ▸ ADJUNTA A LOVABLE: `docs/KNOWLEDGE.md`, `docs/mockups/gestor-mockup.html` (bloque "Resum")
> y los archivos del proyecto (para reutilizar `AppLayout`, `AppSidebar`, i18n, tokens, store).

---

```
AMPLÍA este proyecto de backoffice de KM0 LAB (ya tiene el panel del COMERÇ: rutas /comerc/*,
AppLayout, AppSidebar). NO creas un proyecto nuevo ni rehagas el shell. Introduce DOS ROLES y
un shell que se adapta al rol del usuario autenticado.

▸ CONTEXTO IMPORTANTE
Respeta el stack real: TanStack Start + TanStack Router (rutas por fichero en src/routes/,
routeTree.gen.ts AUTOGENERADO — no lo edites), React 19, Tailwind v4 (tokens en src/styles.css),
shadcn/ui, Zustand, React Query, i18n en src/lib/i18n.ts (objeto `messages`, ca/es/en, defecto
català). La maqueta adjunta es referencia de estructura/comportamiento: NO copies su HTML/CSS
ni la reproduzcas pixel-perfect; reconstruye con el Design System y los componentes existentes.
Sigue docs/KNOWLEDGE.md.

▸ MODELO (respétalo)
- 1 població = 1 administrador + N comerços.
- El usuario tiene rol 'admin' o 'comerc', una població y (si es comerç) un comerç. Todo el
  dato está SCOPED: el admin ve su població; el comerç ve solo su comerç.

▸ QUÉ CONSTRUIR

1) SESIÓN + ROL (mock; frontera: sin auth real)
   - Crea src/stores/useSessionStore.ts (Zustand) con { rol: 'admin' | 'comerc', poblacioId,
     comercId? } y una sesión mock por defecto. Añade un CONMUTADOR DE ROL de desarrollo
     (visible en la cabecera o en una pantalla de acceso) para previsualizar ambos roles:
     "Entrar com a admin" / "Entrar com a comerç".
   - Opcional pero recomendado: una pantalla mock de "Iniciar sessió / Registre" con selección
     de rol y població (Malgrat de Mar / Blanes / Lloret de Mar). Es MOCK: no implementes auth
     real ni escrituras a backend.

2) SHELL ÚNICO Y ROLE-AWARE (modifica lo existente, no lo dupliques)
   - Modifica src/components/backoffice/AppLayout.tsx y AppSidebar.tsx para que la navegación
     y la identidad salgan del ROL del store de sesión (hoy AppLayout hace comercService.getMe()
     y pinta siempre la sidebar del comerç).
   - La sidebar (shadcn Sidebar, collapsible="icon", drawer en móvil) muestra sus ítems según rol:
       · admin: Resum (/admin/resum) · Accions de punts (/admin/accions) · Recompenses
         (/admin/recompenses) · Comerços (/admin/comercos) · Usuaris (/admin/usuaris) ·
         Configuració (/admin/configuracio)
       · comerç: los actuales (El meu QR, Promocions, Estadístiques, La meva fitxa) — no los toques
   - Identidad (bloque who): admin → nombre de la població + "Entitat gestora" (icono 🏛️);
     comerç → lo actual (ComercMe + "Comerç adherit").
   - Iconos lucide sugeridos admin: Home/LayoutDashboard (Resum), Zap (Accions), Gift
     (Recompenses), Store (Comerços), Users (Usuaris), Settings (Configuració).

3) ROUTING POR FICHERO, GUARDADO POR ROL
   - Crea src/routes/admin.tsx (layout: envuelve con AppLayout + <Outlet/>, igual que comerc.tsx),
     src/routes/admin.index.tsx (redirect a /admin/resum) y admin.<seg>.tsx para: resum, accions,
     recompenses, comercos, usuaris, configuracio. (Comerços/Usuaris/Configuració pueden usar el
     patrón Placeholder por ahora.)
   - Guarda las rutas por rol (p. ej. en beforeLoad de admin.tsx / comerc.tsx): si el rol no
     coincide, redirige a la home del propio rol. Tras "entrar", admin → /admin/resum.
   - NO edites src/routeTree.gen.ts (lo regenera el plugin).

4) RESUM DEL ADMIN (src/pages/AdminResum.tsx → /admin/resum)
   - Fila de métricas (grid en desktop, apiladas en móvil): "1.240 Usuaris actius",
     "84.500 Punts en circulació", "312 Bescanvis aquest mes", "18 Accions actives / 24 recompenses".
   - Dos paneles (Card): "Accions més utilitzades" (icono + nom + tipus/punts + nº d'usos) y
     "Últims bescanvis" (recompensa + usuari + temps + punts gastats), con enlaces "Veure tots".
   - Datos MOCK vía un service (p. ej. src/services/adminService.ts → getResum(poblacioId)).

▸ DATOS (MOCK — frontera: todo mockeado; ver KNOWLEDGE §0)
Define tipos (Rol, Poblacio, Sessio, AdminMe) en types/, un mock de la població "Malgrat de
Mar" y sus comerços, y los datos del Resum. Mismo patrón que los services existentes
(async + delay, leyendo fixtures/store).

▸ i18n
Añade al objeto `messages` de src/lib/i18n.ts las claves nuevas (nav.accions, nav.recompenses,
nav.comercos, nav.usuaris — nav.resum y nav.configuracio ya existen; y las de login/Resum) con
{ ca, es, en }, defecto català. Consúmelas con t(). Nada hardcoded en JSX.

▸ ESTADOS
Resum y pantallas de acceso: loading (Skeleton), empty, error (Try again), feliz.

▸ QUÉ NO HACER AHORA
- No implementes auth/registro real, secretos ni backend: todo mock con firma estable.
- No dupliques el shell ni la sidebar; uno solo, adaptable al rol.
- No rompas ni rehagas las pantallas del comerç ni edites routeTree.gen.ts a mano.
- No construyas aún el detalle de Accions ni Recompenses (prompts 01 y 02): rutas placeholder.
- No añadas dependencias fuera de las de package.json.

Objetivo: el backoffice pasa a tener dos roles con un shell único role-aware, sesión mock con
conmutador de rol, routing por fichero guardado por rol y el Resum del admin, coherente
(visual, funcional y técnicamente) con el panel del comerç existente.
```
