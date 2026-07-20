interface LogMetadata {
  endpoint?: string
  method?: string
  duration?: number
  statusCode?: number
  retryAttempt?: number
  attempt?: number
  error?: unknown
  tokenRefreshAttempts?: number
  retryOnUnauthorized?: boolean
  message?: string
  data?: unknown
  path?: string
}

export const logger = {
  info: (message: string, metadata?: LogMetadata) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, metadata || '')
    }
  },
  warn: (message: string, metadata?: LogMetadata) => {
    console.warn(`[WARN] ${message}`, metadata || '')
  },
  error: (message: string, metadata?: LogMetadata) => {
    console.error(`[ERROR] ${message}`, metadata || '')
  },
}

// Basic metrics tracking
export const metrics = {
  failedRequests: 0,
  retryCount: 0,
  incrementFailed: () => {
    metrics.failedRequests++
    if (process.env.NODE_ENV === 'development') {
      console.log('[METRICS] Failed requests:', metrics.failedRequests)
    }
  },
  incrementRetry: () => {
    metrics.retryCount++
    if (process.env.NODE_ENV === 'development') {
      console.log('[METRICS] Retry count:', metrics.retryCount)
    }
  },
}
