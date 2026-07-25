type DimensionRecord = Record<string, unknown>

export function getResultDimensions(result: Record<string, unknown>): DimensionRecord[] {
  const dimensions = result.dimensions
  return Array.isArray(dimensions) ? (dimensions as DimensionRecord[]) : []
}

export function getTopDimensions(result: Record<string, unknown>): DimensionRecord[] {
  const top3 = result.top3
  if (Array.isArray(top3) && top3.length > 0) {
    return top3 as DimensionRecord[]
  }

  const dominantDimensions = result.dominantDimensions
  if (Array.isArray(dominantDimensions) && dominantDimensions.length > 0) {
    return dominantDimensions as DimensionRecord[]
  }

  return getResultDimensions(result).slice(0, 3)
}

export function getDimensionMaxScore(dimension: DimensionRecord): number {
  const maxScore = dimension.maxScore ?? dimension.max
  return typeof maxScore === 'number' && maxScore > 0 ? maxScore : 100
}

export function getDimensionMinScore(dimension: DimensionRecord): number {
  const minScore = dimension.minScore
  return typeof minScore === 'number' ? minScore : 0
}

export function getDimensionPercentage(dimension: DimensionRecord): number {
  const percentage = dimension.percentage
  if (typeof percentage === 'number' && Number.isFinite(percentage)) {
    return Math.min(100, Math.max(0, percentage))
  }

  const score = typeof dimension.score === 'number' ? dimension.score : 0
  const min = getDimensionMinScore(dimension)
  const max = getDimensionMaxScore(dimension)
  if (max <= min) return 0

  return Math.min(100, Math.max(0, ((score - min) / (max - min)) * 100))
}

export function isHollandDimensionSuitable(dimension: DimensionRecord): boolean | undefined {
  if (typeof dimension.suitable === 'boolean') return dimension.suitable
  if (typeof dimension.isSuitableInterest === 'boolean') return dimension.isSuitableInterest
  return undefined
}
