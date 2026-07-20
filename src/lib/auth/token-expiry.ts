const DEFAULT_ACCESS_TOKEN_TTL_SEC = 30 * 24 * 60 * 60 // 30 days (matches backend)

type ExpirySource = {
  expiresIn?: number | string
  expires_in?: number | string
  accessTokenExpires?: number | string
}

function parseDurationString(value: string): number | null {
  const match = value.match(/^(\d+)([smhdw])$/)
  if (!match) return null
  const num = parseInt(match[1], 10)
  const unit = match[2]
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  }
  return num * (multipliers[unit] ?? 0)
}

/** Normalize API expiry to seconds until access token expires. */
export function resolveAccessTokenTtlSeconds(source?: ExpirySource | null): number {
  if (!source) return DEFAULT_ACCESS_TOKEN_TTL_SEC

  const raw = source.expiresIn ?? source.expires_in
  if (typeof raw === 'string') {
    const parsed = parseDurationString(raw)
    if (parsed !== null && parsed > 0) return parsed
  }
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    if (raw > 60 * 60 * 24 * 365) {
      const msUntilExpiry = raw - Date.now()
      if (msUntilExpiry > 0) {
        return Math.floor(msUntilExpiry / 1000)
      }
    }
    return raw
  }

  const absolute = source.accessTokenExpires
  if (absolute != null) {
    const ms = typeof absolute === 'number' ? absolute : Date.parse(String(absolute))
    if (Number.isFinite(ms) && ms > Date.now()) {
      return Math.floor((ms - Date.now()) / 1000)
    }
  }

  return DEFAULT_ACCESS_TOKEN_TTL_SEC
}

export function accessTokenExpiresAt(ttlSeconds: number): number {
  return Date.now() + ttlSeconds * 1000
}
