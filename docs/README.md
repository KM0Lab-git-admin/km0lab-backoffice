# Docs · Backoffice KM0 LAB

Contexto y prompts para ampliar este backoffice con el **rol administrador** (gestor de
població), integrándolo con el panel del **comerç** que ya existe.

## Contenido

- **[KNOWLEDGE.md](KNOWLEDGE.md)** — contrato de generación (arquitectura, roles, permisos,
  menú por rol, reglas de negocio, stack real, tokens, i18n, integración). Pega el *bloque
  compacto* en `Settings → Knowledge` de Lovable y ten el fichero completo en el repo.
- **prompts/** — prompts para ejecutar en Lovable, en este orden:
  1. [00-rols-i-shell.md](prompts/00-rols-i-shell.md) — roles + sesión mock + shell adaptable
     + Resum del admin. **Ejecutar primero** (es la base).
  2. [01-admin-accions-punts.md](prompts/01-admin-accions-punts.md) — Accions de punts
     (llistat + alta/edición).
  3. [02-admin-recompenses.md](prompts/02-admin-recompenses.md) — Recompenses (catàleg +
     alta/edición).
  4. [03-admin-comercos.md](prompts/03-admin-comercos.md) — Comerços de la població
     (llistat + alta/invitació + detall).
  5. [04-admin-usuaris.md](prompts/04-admin-usuaris.md) — Usuaris = veïns del programa
     (llistat + detall, read-only).
  6. [05-admin-configuracio.md](prompts/05-admin-configuracio.md) — Configuració de la
     població (entitat gestora, marca, regles de punts, idioma, zona de perill).
  7. [06-admin-bescanvis.md](prompts/06-admin-bescanvis.md) — Bescanvis: seguiment dels premis
     bescanviats (val amb QR i lliurament físic), amb filtres i detall. Requiere el catálogo
     del prompt 02.
- **mockups/** — referencia visual (no copiar pixel-perfect):
  - `gestor-mockup.html` — pantallas del administrador.
  - `comercos-mockup.html` — sección de comercios de la app + backoffice del comerç.

## Cómo usar en Lovable

1. Pega el bloque compacto de `KNOWLEDGE.md` en el Knowledge del proyecto.
2. Por cada prompt (en orden 00 → 01 → 02): pégalo y **adjunta** `KNOWLEDGE.md`, el mockup
   indicado en su cabecera y, si hace falta, los archivos del proyecto.
3. Valida cada pantalla en 375 / 768 / 1024 / 1280 / 1440 y en ambos roles.
