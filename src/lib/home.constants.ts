export type HomeFeatureItem = {
  key: "tests" | "reports" | "dashboards"
  icon: "brain" | "barChart" | "sparkles"
}

export type HomeHowStep = {
  key: "evaluate" | "map" | "recommend" | "track"
  number: 1 | 2 | 3 | 4
}

export type HomeTestimonial = {
  key: "t1" | "t2" | "t3" | "t4" | "t5"
  rating: 1 | 2 | 3 | 4 | 5
  avatarSrc: string
}

export const HOME_FEATURES: HomeFeatureItem[] = [
  { key: "tests", icon: "brain" },
  { key: "reports", icon: "barChart" },
  { key: "dashboards", icon: "sparkles" },
]

export const HOME_HOW_STEPS: HomeHowStep[] = [
  { key: "evaluate", number: 1 },
  { key: "map", number: 2 },
  { key: "recommend", number: 3 },
  { key: "track", number: 4 },
]

export const HOME_TESTIMONIALS: HomeTestimonial[] = [
  { key: "t1", rating: 5, avatarSrc: "/avatar-placeholder.svg" },
  { key: "t2", rating: 5, avatarSrc: "/avatar-placeholder.svg" },
  { key: "t3", rating: 5, avatarSrc: "/avatar-placeholder.svg" },
  { key: "t4", rating: 5, avatarSrc: "/avatar-placeholder.svg" },
  { key: "t5", rating: 5, avatarSrc: "/avatar-placeholder.svg" },
]

