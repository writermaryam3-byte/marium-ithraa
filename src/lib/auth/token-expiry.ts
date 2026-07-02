const DEFAULT_ACCESS_TOKEN_TTL_SEC = 60 * 60 // 1 hour

type ExpirySource = {
  expiresIn?: number
  expires_in?: number
  accessTokenExpires?: number | string
}

/** Normalize API expiry to seconds until access token expires. */
export function resolveAccessTokenTtlSeconds(source?: ExpirySource | null): number {
  if (!source) return DEFAULT_ACCESS_TOKEN_TTL_SEC

  const raw = source.expiresIn ?? source.expires_in
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    // Values > 1 year are likely absolute timestamps (ms), not TTL seconds.
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
