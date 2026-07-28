# Prompt Lovable · 05 · Administrador · Configuració (de la població)

> Pantalla del rol ADMIN para configurar la població y su programa de puntos. Requiere la base
> del prompt 00 (roles + shell). Instrucciones en castellano; UI strings en catalán + ES/EN
> vía i18n.
>
> ▸ ADJUNTA A LOVABLE: `docs/KNOWLEDGE.md` y los archivos del proyecto.
> ▸ SIN MOCKUP: no hay maqueta específica; mantén la coherencia visual con el resto del
> backoffice (mismos componentes/tokens).

---

```
AMPLÍA este proyecto de backoffice de KM0 LAB con la pantalla del rol ADMIN "Configuració":
los ajustes de la població y su programa de puntos. Intégrate con el shell y los roles ya
definidos (prompt 00): rol 'admin', ruta /admin/configuracio.

▸ CONTEXTO IMPORTANTE
Solo visible para 'admin', dentro del shell y la sidebar ya existentes (ítem "Configuració").
Respeta el stack real (TanStack Router por fichero — no edites routeTree.gen.ts; Tailwind v4
con tokens de styles.css; shadcn; Zustand; React Query; react-hook-form + zod; i18n en el
objeto `messages`, defecto català). Reconstruye con el Design System y REUTILIZANDO los
componentes existentes (Card, Form, Input, Select, Switch, Tabs, ImageUploader, alert-dialog).
Responsive: una columna en móvil. Guardado MOCK + toasts.

▸ RUTA Y PÁGINA
- Ruta: src/routes/admin.configuracio.tsx → import Configuracio from "@/pages/Configuracio"
  (sustituye el placeholder del prompt 00).

▸ ESTRUCTURA (secciones; usa Tabs o Cards apiladas)
1. DADES DE LA POBLACIÓ / ENTITAT GESTORA
   - Nom de la població (read-only: "Malgrat de Mar").
   - Nom de l'entitat gestora.
   - Tipus d'entitat: Ajuntament · Entitat privada (segmented/Select).
   - Email de contacte + persona responsable.
2. MARCA
   - Logo de la població/programa (subida MOCK: reutiliza ImageUploader; previsualización).
3. REGLES DE PUNTS
   - Equivalència punts → valor (p. ex. "1.000 punts = 5 €"): camps punts + valor, o ratio.
   - Caducitat dels punts (mesos; opció "No caduquen" amb Switch).
   - (Opcional) punts per visita per defecte per als comerços nous.
4. IDIOMA
   - Idioma per defecte del programa: Català · Castellà · Anglès (Select). (Es el idioma por
     defecto del contenido; no confundir con el LangSwitcher del propio backoffice.)
5. ZONA DE PERILL (accions mock amb confirmació via alert-dialog)
   - Exportar dades del programa (mock).
   - Regenerar credencials / codis (mock).
   - Desactivar el programa (mock, amb confirmació forta).

Botón "Desar canvis" (guardado mock + toast "Configuració desada"). Validación con
react-hook-form + zod (email válido, valores numéricos ≥ 0, etc.).

▸ DATOS (MOCK — frontera: todo mockeado; scoped a la població del admin)
Define tipos y service (mismo patrón que los services existentes: async + delay + store/fixture):

  type EntitatTipus = 'ajuntament' | 'privada'
  type IdiomaDefecte = 'ca' | 'es' | 'en'
  type PoblacioConfig = {
    poblacioId: string
    poblacioNom: string           // read-only
    entitatNom: string
    entitatTipus: EntitatTipus
    contacteEmail: string
    responsable: string
    logoUrl?: string
    puntsPerEuro: number          // p. ex. 200 (1.000 pts = 5 €)
    caducitatMesos?: number       // undefined = no caduquen
    puntsPerVisitaDefecte?: number
    idiomaDefecte: IdiomaDefecte
  }
  // src/services/configService.ts: get(poblacioId) / update(poblacioId, config)
  // estado en un store Zustand + fixture inicial.

▸ ESTADOS DE PANTALLA
- Loading: Skeleton de las secciones. Error: estado reutilizable con "Tornar a provar".
- Feliz: formulario con los valores; estados de guardado (idle/saving/saved/error) + toast.

▸ i18n
Añade las claves nuevas al objeto `messages` de src/lib/i18n.ts ({ ca, es, en }, defecto
català) y consúmelas con t(). Valores y nombres son datos. Nada hardcoded en JSX.

▸ QUÉ NO HACER AHORA
- No conectes a backend ni base de datos: guardado, exportación y acciones de la zona de
  perill son mock (firma estable), con confirmación donde toque.
- No cambies el idioma del propio backoffice desde aquí (eso es el LangSwitcher del shell);
  aquí solo se define el idioma por defecto del PROGRAMA (dato).
- Solo visible para 'admin'; no toques las pantallas ni la sidebar del comerç. No edites
  routeTree.gen.ts; no añadas dependencias fuera de package.json.

Objetivo: dentro del backoffice existente, el admin configura su població (dades de l'entitat
gestora, marca, regles de punts, idioma i zona de perill), reutilizando los componentes del
proyecto, con sus estados y responsive. Todo mock, scoped a su població.
```
