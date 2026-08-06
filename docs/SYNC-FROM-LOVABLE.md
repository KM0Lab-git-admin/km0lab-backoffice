# Sync Lovable → km0lab-backoffice

Traslado **bajo demanda** del prototipo
[`km0lab-backoffice-lovable`](https://github.com/KM0Lab-git-admin/km0lab-backoffice-lovable)
a este repo de producto. No corre en cada push a Lovable: lo lanzas tú.

## Roles de cada repo

| Repo | Rol |
|------|-----|
| `km0lab-backoffice-lovable` | Prototipo UI (Lovable, solo `main`) |
| `km0lab-backoffice` | Front de producto (`develop` / `main`) |
| `km0lab-api` | API + base de datos (este front la consume) |

## Uso

```bash
# Recomendado: checkout local al lado de este repo
npm run sync:lovable -- --dry-run --source ../km0lab-backoffice-lovable
npm run sync:lovable -- --source ../km0lab-backoffice-lovable

# Listar qué se copiaría
npm run sync:lovable -- --list --source ../km0lab-backoffice-lovable

# Sin --source: usa defaultSourceDir del manifest, o GitHub API + raw
npm run sync:lovable -- --dry-run
```

Revisa el diff y commitea en `develop`.

## Contrato (`scripts/lovable-manifest.json`)

1. **`include`** — globs de lo portable (UI, páginas, routes, mocks, i18n…).
2. **`exclude`** — piezas solo-Lovable (harness, `.lovable/`, etc.).
3. **`locked`** — destinos de producto. El sync **no los sobrescribe**.
   Cuando conectes auth/cliente HTTP real a `km0lab-api`, añade esas
   rutas a `locked` en el mismo commit.

La BD y la lógica de servidor viven en `km0lab-api`, no aquí.

## Flujo de trabajo

1. Iteras UI en Lovable → queda en `km0lab-backoffice-lovable` `main`.
2. Cuando quieras traer cambios: `npm run sync:lovable -- --source ../km0lab-backoffice-lovable`.
3. Revisas diff, resuelves conflictos si tocaste archivos no locked.
4. Merge a `develop` → luego `main` cuando toque desplegar.

## Candados iniciales

Reservados para la integración con `km0lab-api` (aún pueden no existir):

- `src/lib/env.ts`
- `src/services/apiClient.ts` / `km0labApiClient.ts`
- `src/services/auth.ts`
- `.env*`
