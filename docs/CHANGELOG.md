# Changelog — Backoffice KM0 LAB

Registre de canvis del backoffice de comerços de KM0 LAB.
Portat des del prototip Lovable (`km0lab-backoffice-lovable`).

Format basat en [Keep a Changelog](https://keepachangelog.com/) i
[Semantic Versioning](https://semver.org/lang/ca/).

---

## [Unreleased]

### Fixed
- Recompenses: no demana `/rewards/{id}/media` si `has_image` és fals
  (evita 404 pintats com a CORS al catàleg).

---

## [1.3.0] — 2026-09-13

Portabilitat 1.3.0 des de Lovable (`km0lab-backoffice-lovable` `main`).
La UI integrada amb `km0lab-api` es preserva (forms i18n, services, auth).
El catàleg visible surt de l'API, no dels fixtures de Lovable.

### Added
- Imatges finals de vals 5/10/20/50 €, gorra, samarreta, bossa i cinema
  materialitzades a `public/rewards/` (PNG reals; sense CDN `/__l5e/`).
- Seed de `km0lab-api`: les mateixes imatges a `scripts/seed_media/rewards/`
  i `PUT` implícit a `reward_media` via `seed_fake_rewards` /
  `python -m scripts.seed_reward_images`.
- Catàleg demo: **Gorra KM0 LAB** i **Entrada de cinema** (punts demo
  existents dels vals/bossa/samarreta no es toquen).

### Changed
- Manifest de sync: `exclude` per fixtures/assets/stores mock de Lovable;
  `locked` amplia i18n, types de producte i formularis amb `I18nField`.
- Pre-flight documentat: cada porte baixa `origin/main` de Lovable abans
  del sync (`docs/SYNC-FROM-LOVABLE.md`).

### Preservat de la integració real (no portat de Lovable)
- Services, mappers, `apiClient`, stores d'auth, `I18nField` als forms,
  claus `shopCategories.*` i punts del seed demo.

---

## [1.2.0] — 2026-07-29

Portabilitat 1.2.0 des de Lovable. La UI ve de Lovable; la integració amb
`km0lab-api` (services, mappers, `types/api.ts`, `apiClient`, stores reals)
es preserva bloquejant-la al manifest de sync i reconciliant a mà.

### Added
- Admin · Recompenses: icones per defecte per tipus de recompensa (Wallet per
  `saldo`, BadgePercent per `descompte`, Shirt per `marxandatge`, Sparkles per
  `experiencia`, Package per `producte`, Wrench per `servei`) via Lucide. Es
  mostren a la targeta del catàleg quan la recompensa no té `imatgeUrl` i al
  placeholder de l'`ImageUploader` del formulari (canvien en viu segons el
  tipus). Nou component `RecompensaTipusIcon` i prop opcional `placeholderNode`
  a `ImageUploader`.
- Admin · Accions de punts: tipus `esdeveniment` ara usa el camp `url` per
  apuntar a la pàgina d'inscripció (substitueix el selector
  `esdevenimentId`). Camp obligatori i validat.
- Admin · Accions de punts: interval de reactivació del QR per al tipus
  `escaneig_qr`. Nous camps `cooldownValor` + `cooldownUnitat`
  (`dies` | `setmanes` | `mesos`). Indica quant temps ha de passar perquè el
  mateix veí pugui tornar a escanejar el QR del mateix comerç i rebre punts.
  Buit = sense límit temporal.
- Admin · Accions de punts: nou tipus `primer_escaneig` — bonificació única
  per veí la primera vegada que escaneja un QR de qualsevol comerç KM0 LAB.
- Admin · Accions de punts: nou tipus `aniversari` (icona Cake).
- Admin · Accions de punts: bandera `visibleAHome: boolean` per decidir si
  l'acció apareix destacada a la home de l'app dels veïns. Independent
  d'`activa`. Badge "Amagada a la home" al llistat quan és `false`.

### Changed
- Rutes i slugs en anglès (preparació de portabilitat al monorepo de
  producció). El copy i les dades de domini es mantenen via i18n; només
  canvien URLs i noms de fitxer de rutes:
  - `/comerc` → `/merchant` (i subrutes: `my-qr`, `my-profile`, `promotions`,
    `vouchers`, `statistics`, `settings`)
  - `/admin/resum` → `/admin/overview`, `/admin/accions` → `/admin/actions`,
    `/admin/recompenses` → `/admin/rewards`, `/admin/bescanvis` →
    `/admin/redemptions`, `/admin/comercos` → `/admin/merchants`,
    `/admin/usuaris` → `/admin/users`, `/admin/configuracio` →
    `/admin/settings`
  - `/registre` → `/register`
- Renombrat `src/types/comerc.ts` → `src/types/merchant.ts` (identificadors del
  domini en anglès; tipus i camps sense canvis).
- `escaneig_qr` (form): nom i descripció fixos per idioma; s'oculten límits,
  vigència i condicions (el límit temporal es gestiona amb el cooldown).
  Eliminat el selector de comerç (l'acció aplica a qualsevol comerç de la
  població).
- `registre` (form): nom i descripció fixos per idioma; només es demanen els
  punts.
- Mapper `accioFromApi`/`accioToApi`: `cooldownValor`+`cooldownUnitat` ↔
  `cooldown_days` (int) de l'API. Conversió: dies = valor × factor (dies=1,
  setmanes=7, mesos=30); invers preferència mesos > setmanes > dies.
- `accionsService.accioTipusList` ampliat amb `primer_escaneig` i
  `aniversari`; eliminat `getEsdevenimentsOptions` (substituït per `url`).
- Manifest de sync (`scripts/lovable-manifest.json`): `locked` ampliat per
  protegir els 15 services reals, mappers, `types/api.ts`, `types/comerc.ts`,
  `apiClient`, `useAuthStore` i `useSessionStore`; `exclude` per als mock
  stores de bescanvis/pagaments. Així el sync no regressa la integració real.
- Eliminats els mock stores legacy no usats (`useAdminAccionsStore`,
  `useAdminComercosStore`, `useAdminConfigStore`, `useAdminRecompensesStore`,
  `useBackofficeStore`).

### Preservat de la integració real (no portat de Lovable)
- Tots els services reals contra `km0lab-api`, mappers, `types/api.ts`,
  `apiClient`, `useAuthStore`, `useSessionStore`.
- i18n de categories (`shopCategories.*`) i traducció slug→label als
  components de fitxa/comerços (les categories es mostren en l'idioma
  seleccionat, no en català hardcodejat).

### TODO backend (km0lab-api) — pendents per fer funcionals algunes features
- Tipus `primer_escaneig`: l'API encara no accepta el tipus `first_scan` al
  patró de `PointActionCreate.type`. Fins que no s'hi afegeixi, la creació
  d'accions `primer_escaneig` des del backoffice fallarà amb 422. El frontend
  ja el mapeja a `first_scan`.
- Bandera `visibleAHome`: l'API no exposa `visible_home` a
  `PointAction`. El frontend l'omet a l'enviament i la per defecte a `true`
  en lectura.
- Camp `url` per `event`: ja suportat per l'API (`PointAction.url`).
- Cooldown QR: l'API ja suporta `cooldown_days` (int); la conversió
  valor+unitat ↔ dies es fa al mapper del backoffice.

---

## [1.1.0] — 2026-07-28

Primera versió portada al monorepo de producció. Veure `docs/CHANGELOG.md`
del repo Lovable per al detall original.

### Added
- Rol comerç: `El meu QR`, `Promocions`, `La meva fitxa`, `Estadístiques`,
  `Validar vals`.
- Rol admin: `Resum`, `Accions de punts`, `Recompenses`, `Comerços`,
  `Usuaris`, `Configuració`, `Bescanvis` (vals, pagaments, lliuraments).
- Autenticació real contra `km0lab-api` (OTP), sessió persistida.
- Shell responsive amb sidebar segons rol, `LangSwitcher` (ca/es/en) i
  guards de ruta per àrea.
- Design system KM0 aplicat a totes les pantalles.
