# km0lab-backoffice

Front de producto del **backoffice KM0 LAB** (roles admin / comerç).

- Prototipo UI: [`km0lab-backoffice-lovable`](https://github.com/KM0Lab-git-admin/km0lab-backoffice-lovable) (Lovable)
- API + BD: [`km0lab-api`](https://github.com/KM0Lab-git-admin/km0lab-api)
- Sync bajo demanda desde Lovable: `docs/SYNC-FROM-LOVABLE.md`

## Desarrollo

```sh
bun install
bun run dev
```

Ramas: `develop` (integración) y `main` (producción).

## Sync desde Lovable

```sh
bun run sync:lovable -- --dry-run --source ../km0lab-backoffice-lovable
bun run sync:lovable -- --source ../km0lab-backoffice-lovable
```

## Stack

- TanStack Start + Router
- React 19 · TypeScript · Tailwind CSS 4
- shadcn/ui · Zustand · React Query · Zod
