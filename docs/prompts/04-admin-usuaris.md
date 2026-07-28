# Prompt Lovable · 04 · Administrador · Usuaris (veïns del programa)

> Pantalla del rol ADMIN para consultar los veïns inscritos en el programa de puntos de su
> població: llistat + detall. Requiere la base del prompt 00 (roles + shell). Instrucciones en
> castellano; UI strings en catalán + ES/EN vía i18n.
>
> ▸ ADJUNTA A LOVABLE: `docs/KNOWLEDGE.md` y los archivos del proyecto.
> ▸ SIN MOCKUP: no hay maqueta específica; mantén la coherencia visual con el resto del
> backoffice (mismos componentes/tokens). Inspiración: la tabla "Els meus clients" de la
> pantalla Estadístiques del comerç (src/pages/Estadistiques.tsx).

---

```
AMPLÍA este proyecto de backoffice de KM0 LAB con la pantalla del rol ADMIN "Usuaris": los
veïns inscritos en el programa de puntos de la població. Intégrate con el shell y los roles ya
definidos (prompt 00): rol 'admin', ruta /admin/usuaris.

▸ CONTEXTO IMPORTANTE
Solo visible para 'admin', dentro del shell y la sidebar ya existentes (ítem "Usuaris").
Respeta el stack real (TanStack Router por fichero — no edites routeTree.gen.ts; Tailwind v4
con tokens de styles.css; shadcn; Zustand; React Query; i18n en el objeto `messages`, defecto
català). Reconstruye con el Design System y REUTILIZANDO los componentes existentes (Table,
Card, Badge, Input de cerca, Skeleton). Responsive: tabla en desktop, tarjetas en móvil.

▸ QUÉ ES
Son los VEÏNS (ciudadanos) inscritos en el programa de puntos de la població — NO los comercios
ni las cuentas de backoffice. El administrador los consulta para ver actividad y puntos. Es
una vista de SOLO LECTURA (el admin no edita los datos personales del veí).

▸ PRIVACIDAD (respétalo)
El email y el teléfono de un veí SOLO se muestran si el usuario los ha compartido con el
programa desde la app; si no, muestra "No compartit". (Mismo criterio que la tabla de clientes
de la pantalla Estadístiques del comerç.)

▸ RUTA Y PÁGINA
- Ruta: src/routes/admin.usuaris.tsx → import Usuaris from "@/pages/Usuaris" (sustituye el
  placeholder del prompt 00). Detalle con Dialog/Sheet o ruta de detalle.

▸ PANTALLA A · LLISTAT (/admin/usuaris)
- Cabecera: título "Usuaris" + guía "Veïns inscrits al programa de punts de {població}."
- Buscador por nombre/email + (opcional) filtro por nivell o activitat.
- Lista (Table en desktop, tarjetas en móvil). Cada fila: nom, punts acumulats, nivell,
  nº d'escanejos/visites, data d'alta, última activitat, contacte (email/telèfon o "No
  compartit"). Fila clicable → detalle.
- Mock inicial (mín. 8): p. ej. Marc P. (1.260 pts, nivell 4, 18 escanejos, comparteix
  contacte); Laia R. (980 pts, nivell 3); Joan S. (2.140 pts, nivell 5, no comparteix); Núria
  T. (450 pts, nivell 2); … variedad de niveles y actividad.
- Estados: loading (Skeleton de filas), empty ("Encara no hi ha veïns inscrits en aquest
  període"), error (Try again).

▸ PANTALLA B · DETALL D'UN VEÍ (read-only)
- Capçalera amb nom, nivell i punts acumulats.
- Resum: nº d'escanejos, comerços visitats, recompenses bescanviades, data d'alta.
- Historial d'activitat (llista): escanejos de QR, accions de punts completades i bescanvis de
  recompenses, amb data i punts (+/−). Tot mock.
- Contacte només si compartit.
- (Opcional) acció mock "Ajustar punts manualment" amb confirmació — deixa-la com a placeholder
  si es fa; per defecte, read-only.

▸ DATOS (MOCK — frontera: todo mockeado; scoped a la població del admin)
Define tipos y service (mismo patrón que los services existentes: async + delay + fixtures):

  type VeiActivitatTipus = 'escaneig' | 'accio' | 'bescanvi'
  type VeiActivitat = {
    id: string; tipus: VeiActivitatTipus; descripcio: string; data: string; punts: number
  }
  type VeiPrograma = {
    id: string; poblacioId: string; nom: string
    puntsAcumulats: number; nivell: number
    escanejos: number; comercosVisitats: number; bescanvis: number
    dataAlta: string; ultimaActivitat: string
    contacteCompartit: boolean; email?: string; telefon?: string
    activitat?: VeiActivitat[]   // per al detall
  }
  // src/services/usuarisService.ts: list(poblacioId) / get(id)

▸ i18n
Añade las claves nuevas al objeto `messages` de src/lib/i18n.ts ({ ca, es, en }, defecto
català) y consúmelas con t(). Nombres, emails y valores son datos. Nada hardcoded en JSX.

▸ QUÉ NO HACER AHORA
- No conectes a backend ni base de datos: todo mock.
- No muestres contacto que no esté marcado como compartido.
- No permitas editar datos personales del veí (vista read-only; salvo la acción opcional de
  ajustar puntos como placeholder).
- Solo visible para 'admin'; no toques las pantallas ni la sidebar del comerç. No edites
  routeTree.gen.ts; no añadas dependencias fuera de package.json.

Objetivo: dentro del backoffice existente, el admin consulta los veïns del programa (llistat +
detall d'activitat, respetando la privacidad del contacto), reutilizando los componentes del
proyecto, con sus estados loading/empty/error y responsive. Todo mock, scoped a su població.
```
