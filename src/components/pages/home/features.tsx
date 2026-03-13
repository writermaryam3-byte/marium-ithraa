"use client"

import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { HOME_FEATURES } from "@/lib/home.constants"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Sparkles, Brain } from "lucide-react"

const ICONS = {
  brain: Brain,
  barChart: BarChart3,
  sparkles: Sparkles,
} as const

export default function HomeFeatures() {
  const locale = useLocale()
  const t = useTranslations("HomePage.Features")
  const isRtl = locale === "ar"

  return (
    <section className="app-container py-14 lg:py-20">
      <div className={cn(isRtl ? "text-right" : "text-left")}>
        <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">
          {t("title")}
        </h2>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {HOME_FEATURES.map((f, idx) => {
          const Icon = ICONS[f.icon]
          const tone =
            idx === 0
              ? "bg-chart-3/15"
              : idx === 1
                ? "bg-chart-5/15"
                : "bg-chart-2/15"

          return (
            <Card
              key={f.key}
              className={cn(
                "rounded-2xl border border-border/60 shadow-sm",
                tone
              )}
            >
              <CardContent className={cn("p-6", isRtl ? "text-right" : "text-left")}>
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-background/60 text-primary shadow-sm">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-foreground">
                      {t(`items.${f.key}.title`)}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {t(`items.${f.key}.description`)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

