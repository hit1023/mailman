import { existsSync, readFileSync, writeFileSync } from 'fs'

const ENV_PATH = process.env.ENV_FILE_PATH ?? '/app/.env'

export function readEnvFile() {
  if (!existsSync(ENV_PATH)) return {}
  const values = {}
  for (const line of readFileSync(ENV_PATH, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    values[trimmed.slice(0, idx)] = trimmed.slice(idx + 1)
  }
  return values
}

export function writeEnvFile(updates) {
  const lines = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf-8').split('\n') : []
  const applied = new Set()

  const newLines = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return line
    const idx = trimmed.indexOf('=')
    if (idx === -1) return line
    const key = trimmed.slice(0, idx)
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      applied.add(key)
      return `${key}=${updates[key]}`
    }
    return line
  })

  for (const [key, value] of Object.entries(updates)) {
    if (!applied.has(key)) newLines.push(`${key}=${value}`)
  }

  writeFileSync(ENV_PATH, newLines.join('\n').replace(/\n*$/, '\n'))
}
