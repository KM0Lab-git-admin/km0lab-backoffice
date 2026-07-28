# Prompt Lovable · 02 · Administrador · Recompenses

> Pantallas del rol ADMIN para gestionar el catálogo de recompensas canjeables por puntos:
> catàleg + alta/edición. Requiere la base del prompt 00 (roles + shell). Instrucciones en
> castellano; UI strings en catalán + ES/EN vía i18n.
>
> ▸ ADJUNTA A LOVABLE: `docs/KNOWLEDGE.md`, `docs/mockups/gestor-mockup.html` (bloques
> "Recompenses — catàleg" y "nova/editar") y los archivos del proyecto.

---

```
AMPLÍA este proyecto de backoffice de KM0 LAB con las pantallas del rol ADMIN para
"Recompenses": el CATÀLEG y el formulario de ALTA/EDICIÓ. Intégrate con el shell y los roles
ya definidos (prompt 00): rol 'admin', rutas /admin/*.

▸ CONTEXTO IMPORTANTE
Solo visible para 'admin', dentro del shell y la sidebar ya existentes (ítem "Recompenses").
Respeta el stack real (TanStack Router por fichero — no edites routeTree.gen.ts; Tailwind v4
con tokens de styles.css; shadcn; Zustand; React Query; react-hook-form + zod; i18n en el
objeto `messages`). La maqueta adjunta es referencia: NO copies su HTML/CSS ni pixel-perfect;
reconstruye con el Design System y REUTILIZANDO los componentes existentes (Card, badges,
Form, Select, ImageUploader ya presente en components/backoffice, etc.). SIGUE EL MISMO PATRÓN
de listado + alta/edición que la pantalla del comerç "Promocions". Layout responsive: grid en
desktop, una columna en móvil.

▸ QUÉ SON LAS RECOMPENSES
El catálogo de productos, servicios o ventajas que los veïns pueden CANJEAR por sus puntos
(p. ej. 1.000 pts → val de 5€, descomptes, entrades, experiències, marxandatge). El canje lo
hace el vecino en la sección "Recompenses" de la APP (fuera del backoffice); aquí el admin
SOLO administra el catálogo. Las recompenses NO son promocions (las promocions del comerç son
informativas; las recompenses se pagan con puntos).

▸ RUTA Y PÁGINA
- Ruta: src/routes/admin.recompenses.tsx → import Recompenses from "@/pages/Recompenses".
- Alta/edición con Dialog/Sheet o rutas de detalle (como resuelva Promocions).

▸ PANTALLA A · CATÀLEG (/admin/recompenses)
- Cabecera: título "Recompenses" + guía "Catàleg de recompenses que els veïns poden bescanviar
  per punts." + botón "Afegir recompensa".
- Grid de tarjetas (Card; 3 col en desktop → 1 en móvil). Cada tarjeta: imagen, tipus
  (etiqueta), nom, descripció breve, PUNTS necessaris, valor/import, estoc, y BADGE D'ESTAT
  (Activa / Inactiva / Esgotada), + acciones editar/eliminar. Inactivas/esgotades atenuadas.
- Mock inicial (mín. 6): "Val de 5€" (saldo, 1.000 pts, 5€, estoc ∞, Activa); "Val de 10€"
  (saldo, 2.000 pts, 10€, ∞, Activa); "Entrada de cinema" (experiencia, 1.500 pts, estoc 20,
  Activa); "Gorra KM0 LAB" (marxandatge, 600 pts, estoc 45, Activa); "Samarreta KM0 LAB"
  (marxandatge, 800 pts, estoc 0, ESGOTADA); "10% a la llibreria Robafaves" (descompte, 500
  pts, Inactiva).
- Estados: loading (Skeleton de tarjetas), empty ("Encara no hi ha recompenses" + CTA "Afegir
  la primera recompensa"), error (Try again). Toast al activar/desactivar/eliminar.

▸ PANTALLA B · NOVA / EDITAR RECOMPENSA
Formulario (react-hook-form + zod; errores por campo; guardado mock + toast "Recompensa
desada") con TODOS los campos:
- Imatge (subida MOCK: reutiliza el patrón/ImageUploader ya existente; previsualización; no
  subas a backend real).
- Nom (texto).
- Descripció (textarea).
- Tipus de recompensa (segmented/Select): Descompte · Saldo · Producte · Servei ·
  Marxandatge · Experiència.
- Punts necessaris (número) + Valor / import (según tipo, p. ej. 5 €).
- Comerços / serveis on es pot fer servir (multi-select: "Tots els adherits" o comerços
  concrets de la població).
- Estoc disponible (número) + opción "Estoc il·limitat" (Switch). Si estoc = 0 → estat
  sugerido "Esgotada".
- Data d'inici + Data de fi (opcional, date-fns).
- Condicions d'ús (textarea).
- Estat (segmented): Activa · Inactiva · Esgotada.
- Botón "Desar recompensa".

▸ DATOS (MOCK — frontera: todo mockeado; scoped a la població del admin)
Define tipos y service (mismo patrón que promocionsService):

  type RecompensaTipus = 'descompte' | 'saldo' | 'producte' | 'servei'
                       | 'marxandatge' | 'experiencia'
  type RecompensaEstat = 'activa' | 'inactiva' | 'esgotada'
  type Recompensa = {
    id: string; poblacioId: string
    nom: string; descripcio: string; imatgeUrl?: string
    tipus: RecompensaTipus; puntsNecessaris: number; valor?: string
    comercos: string[] | 'tots'
    estoc?: number            // undefined = il·limitat
    dataInici?: string; dataFi?: string
    condicions?: string; estat: RecompensaEstat
  }
  // src/services/recompensesService.ts: list / get / create / update / remove
  // estado en un store Zustand + fixture inicial

▸ i18n
Añade las claves nuevas al objeto `messages` de src/lib/i18n.ts ({ ca, es, en }, defecto
català) y consúmelas con t(). Nombres, valores e imágenes son datos. Nada hardcoded en JSX.

▸ QUÉ NO HACER AHORA
- No implementes el canje real ni backend: alta/edición mutan solo el mock (firma estable). El
  canje por puntos lo hace el vecino en la APP, no aquí.
- No subas imágenes a un backend real: la subida es mock/placeholder con previsualización.
- Solo visible para 'admin'; no toques las pantallas ni la sidebar del comerç.
- No dupliques el shell/sidebar (usa el existente, ítem "Recompenses" activo).
- No edites routeTree.gen.ts a mano; no añadas dependencias fuera de package.json.

Objetivo: dentro del backoffice existente, el admin gestiona el catálogo de recompensas
(catàleg + alta/edición con todos los campos y estados activa/inactiva/esgotada), reutilizando
los componentes y el patrón de Promocions, con sus 4 estados y responsive. Todo mock, scoped a
su població.
```
