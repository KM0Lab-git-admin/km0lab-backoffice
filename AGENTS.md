# AGENTS — km0lab-backoffice

Front de producto del backoffice KM0 LAB. La UI nace en Lovable
(`km0lab-backoffice-lovable`) y se trae aquí con `npm run sync:lovable`
(ver `docs/SYNC-FROM-LOVABLE.md`).

## Frontera

- **Este repo**: UI, rutas, i18n, cliente HTTP hacia `km0lab-api`.
- **`km0lab-api`**: autenticación, dominio y base de datos.
- **`events-query`**: noticias/agenda (no aplica a este panel salvo
  lecturas puntuales si se acuerdan).

## Sync Lovable

- **Antes de cada porte:** `git fetch` + `checkout main` + `pull --ff-only`
  en `km0lab-backoffice-lovable`. Nunca sync desde otra rama ni desde un
  `main` desactualizado. Detalle en `docs/SYNC-FROM-LOVABLE.md`.
- No sobrescribe rutas en `locked` del manifest.
- Tras sync: revisar `git diff`, tipado y pantallas afectadas.
- Fixes visuales van primero a Lovable `main`; luego sync a `develop`.
- Prohibido depender del CDN Lovable (`/__l5e/...`).

## Ramas

- `develop` — integración diaria
- `main` — estable / deploy
