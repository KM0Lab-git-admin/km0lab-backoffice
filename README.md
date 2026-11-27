# km0lab-backoffice

Front de producto del **backoffice KM0 LAB** (roles admin / comerç).

- Prototipo UI: [`km0lab-backoffice-lovable`](https://github.com/KM0Lab-git-admin/km0lab-backoffice-lovable) (Lovable)
- API + BD: [`km0lab-api`](https://github.com/KM0Lab-git-admin/km0lab-api)
- Sync bajo demanda desde Lovable: `docs/SYNC-FROM-LOVABLE.md`

## Desarrollo

```sh
npm install
npm run dev
```

Ramas: `develop` (integración) y `main` (producción).

## Login local

OTP `123456` (API en development). Documentación: `km0lab-api/docs/LOCAL-ACCOUNTS.md`.

| Botón / email | Pueblo |
|---------------|--------|
| Admin (demo) `admin@km0lab.com` | Demo KM0 |
| Admin Malgrat `admin-malgrat@km0lab.com` | Malgrat real |
| Comerç 1/2 Malgrat | Malgrat real |

Gmail y otros correos piden OTP enviado (no 123456).

## Sync desde Lovable

Siempre desde `main` de Lovable actualizado. Si el checkout local está
desfasado, el sync porta una versión vieja.

```powershell
cd ..\km0lab-backoffice-lovable
git fetch origin
git checkout main
git pull --ff-only origin main
git status -sb
```

Luego, en este repo (`develop`):

```sh
npm run sync:lovable -- --dry-run --source ../km0lab-backoffice-lovable
npm run sync:lovable -- --source ../km0lab-backoffice-lovable
```

Guía completa: `docs/SYNC-FROM-LOVABLE.md`.

## Stack

- TanStack Start + Router
- React 19 · TypeScript · Tailwind CSS 4
- shadcn/ui · Zustand · React Query · Zod
