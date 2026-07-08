/**
 * Updates useTranslations/getTranslations namespace references in src/.
 * Run after migrate-i18n.mjs: node scripts/update-i18n-references.mjs
 */
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'src')
const mapPath = path.join(ROOT, 'scripts', 'i18n-namespace-map.json')
const { namespaceMap, keyPathMap } = JSON.parse(fs.readFileSync(mapPath, 'utf8'))

const sortedNamespaces = Object.entries(namespaceMap).sort(([a], [b]) => b.length - a.length)

function walk(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full)
  }
  return files
}

function replaceNamespaces(content) {
  let next = content

  for (const [oldNs, newNs] of sortedNamespaces) {
    const patterns = [
      new RegExp(`useTranslations\\(\\s*['"\`]${escapeRegExp(oldNs)}['"\`]\\s*\\)`, 'g'),
      new RegExp(`getTranslations\\(\\s*['"\`]${escapeRegExp(oldNs)}['"\`]\\s*\\)`, 'g'),
      new RegExp(
        `getTranslations\\(\\{\\s*locale[^}]*namespace:\\s*['"\`]${escapeRegExp(oldNs)}['"\`]`,
        'g',
      ),
    ]

    for (const pattern of patterns) {
      next = next.replace(pattern, (match) => match.replace(oldNs, newNs))
    }
  }

  return next
}

function replaceKeyPaths(content) {
  let next = content
  const sortedKeys = Object.entries(keyPathMap).sort(([a], [b]) => b.length - a.length)

  for (const [oldKey, newKey] of sortedKeys) {
    next = next.replace(new RegExp(`(['"\`])${escapeRegExp(oldKey)}\\1`, 'g'), `$1${newKey}$1`)
  }

  return next
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let changedFiles = 0

for (const file of walk(SRC)) {
  const original = fs.readFileSync(file, 'utf8')
  let updated = replaceNamespaces(original)
  updated = replaceKeyPaths(updated)

  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8')
    changedFiles += 1
    console.log(`? ${path.relative(ROOT, file)}`)
  }
}

console.log(`Updated ${changedFiles} files.`)
