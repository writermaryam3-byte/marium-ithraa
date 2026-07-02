export const METRIC_VARIANTS = {
  purple: 'bg-stat-purple text-white',
  indigo: 'bg-metric-indigo text-white',
  pink: 'bg-metric-pink text-white',
} as const

export type MetricVariant = keyof typeof METRIC_VARIANTS
