#!/usr/bin/env node
/**
 * sync-lovable.mjs
 *
 * Sincroniza bajo demanda el prototipo Lovable
 * (`km0lab-backoffice-lovable`) hacia este repo de producto
 * (`km0lab-backoffice`). Mapping 1:1 (misma ruta relativa).
 *
 * Política: Lovable es source of truth visual/UI. El script SOBRESCRIBE
 * destinos incluidos, excepto `locked` y `exclude`. Git es la red de
 * seguridad: revisa el diff antes de commitear.
 *
 * Uso:
 *   bun run sync:lovable
 *   bun run sync:lovable -- --dry-run
 *   bun run sync:lovable -- --source ../km0lab-backoffice-lovable
 *   node scripts/sync-lovable.mjs --dry-run --source ../km0lab-backoffice-lovable
 *
 * Requiere Node 20+.
 */

import { readFile, writeFile, mkdir, access, readdir, stat } from 'node:fs/promises'
import { dirname, resolve, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '..')

function parseArgs(argv) {
  const args = { dryRun: false, source: null, manifest: null, list: false }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--dry-run') args.dryRun = true
    else if (argv[i] === '--list') args.list = true
    else if (argv[i] === '--source') args.source = argv[(i += 1)]
    else if (argv[i] === '--manifest') args.manifest = argv[(i += 1)]
  }
  return args
}

function toPosix(p) {
  return p.split(sep).join('/')
}

/** Glob simple: * = segmento, ** = cualquier profundidad. */
function globToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\0')
    .replace(/\*/g, '[^/]*')
    .replace(/\0/g, '.*')
  return new RegExp(`^${escaped}$`)
}

function matchesAny(path, patterns) {
  return patterns.some((p) => globToRegExp(p).test(path))
}

function isLocked(to, locked) {
  return locked.some((l) => {
    if (l.endsWith('/')) return to === l.slice(0, -1) || to.startsWith(l)
    return to === l || to.startsWith(`${l}/`)
  })
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function walkLocal(rootDir) {
  const out = []
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue
        await walk(abs)
      } else if (entry.isFile()) {
        out.push(toPosix(relative(rootDir, abs)))
      }
    }
  }
  await walk(rootDir)
  return out
}

async function listRemoteTree(repo, ref) {
  const url = `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'km0lab-backoffice-sync' },
  })
  if (!response.ok) {
    throw new Error(
      `GitHub tree HTTP ${response.status}: ${response.statusText}. ` +
        `Usa --source <dir-local> (recomendado).`
    )
  }
  const data = await response.json()
  return (data.tree ?? [])
    .filter((n) => n.type === 'blob')
    .map((n) => n.path)
}

const TEXT_EXT = /\.(tsx?|jsx?|mjs|cjs|json|css|md|html?|svg|txt|ya?ml|toml|env)$/i

function isTextPath(from) {
  return TEXT_EXT.test(from)
}

async function readSourceFile(source, from) {
  const asText = isTextPath(from)
  if (source.kind === 'local') {
    return readFile(join(source.root, from), asText ? 'utf8' : null)
  }
  const url = `https://raw.githubusercontent.com/${source.repo}/${source.ref}/${from}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al leer ${from}`)
  }
  return asText ? response.text() : Buffer.from(await response.arrayBuffer())
}

async function resolveSource(args, manifest) {
  const preferred =
    args.source ??
    manifest.defaultSourceDir ??
    null

  if (preferred) {
    const root = resolve(REPO_ROOT, preferred)
    if (!(await exists(root))) {
      throw new Error(
        `Fuente local no encontrada: ${root}\n` +
          `Clona km0lab-backoffice-lovable al lado o pasa --source <ruta>.`
      )
    }
    const isDir = (await stat(root)).isDirectory()
    if (!isDir) throw new Error(`--source debe ser un directorio: ${root}`)
    return { kind: 'local', root, label: root }
  }

  const repo = manifest.sourceRepo
  const ref = manifest.sourceRef ?? 'main'
  if (!repo) {
    throw new Error('Sin fuente: define defaultSourceDir o sourceRepo en el manifest.')
  }
  return { kind: 'remote', repo, ref, label: `github:${repo}@${ref}` }
}

function selectFiles(allPaths, include, exclude) {
  return allPaths
    .filter((p) => matchesAny(p, include))
    .filter((p) => !matchesAny(p, exclude))
    .sort()
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const manifestPath = args.manifest
    ? resolve(REPO_ROOT, args.manifest)
    : resolve(SCRIPT_DIR, 'lovable-manifest.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

  const include = manifest.include ?? []
  const exclude = manifest.exclude ?? []
  const locked = manifest.locked ?? []

  if (include.length === 0) {
    console.error('Manifest sin "include". Añade globs en scripts/lovable-manifest.json.')
    process.exit(1)
  }

  const source = await resolveSource(args, manifest)
  const allPaths =
    source.kind === 'local'
      ? await walkLocal(source.root)
      : await listRemoteTree(source.repo, source.ref)

  const files = selectFiles(allPaths, include, exclude)

  if (args.list) {
    console.log(`Archivos que sincronizaría (${files.length}) desde ${source.label}:\n`)
    for (const f of files) {
      const lock = isLocked(f, locked) ? ' [LOCKED]' : ''
      console.log(`  ${f}${lock}`)
    }
    return
  }

  console.log(`Sincronizando ${files.length} archivos desde:`)
  console.log(`  ${source.label}${args.dryRun ? '  (dry-run: no se escribe nada)' : ''}\n`)

  const summary = { ok: 0, skippedLocked: 0, fail: 0 }

  for (const from of files) {
    const to = from // mapping 1:1
    if (isLocked(to, locked)) {
      console.log(`  · ${to} ... BLOQUEADO`)
      summary.skippedLocked += 1
      continue
    }

    process.stdout.write(`  · ${to}  ←  ${from} ... `)
    try {
      const content = await readSourceFile(source, from)
      const destAbs = resolve(REPO_ROOT, to)
      if (!args.dryRun) {
        await mkdir(dirname(destAbs), { recursive: true })
        await writeFile(destAbs, content)
      }
      console.log(args.dryRun ? 'OK (dry-run)' : 'OK')
      summary.ok += 1
    } catch (err) {
      console.log('FAIL')
      console.error(`    ${err.message}`)
      summary.fail += 1
    }
  }

  console.log(
    `\nResumen: ${summary.ok} sincronizados, ${summary.skippedLocked} bloqueados, ` +
      `${summary.fail} con fallo.`
  )
  console.log('\nPasos siguientes:')
  console.log('  - Revisar diff: git status && git diff')
  console.log('  - Si hay pantallas nuevas, comprobar rutas en src/routes/')
  console.log('  - Al conectar km0lab-api, añadir services reales a "locked"')
  console.log('  - Commitear en develop (no en main sin revisión)')

  if (summary.fail > 0) process.exit(1)
}

main().catch((err) => {
  console.error('Error inesperado:', err)
  process.exit(1)
})
