"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { HOME_HOW_STEPS } from "@/lib/home.constants"
import { Card, CardContent } from "@/components/ui/card"

export default function HomeHowItWorks() {
  const t = useTranslations("HomePage.HowItWorks")

  return (
    <section className="app-container pb-14 lg:pb-20">
      <div>
        <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {HOME_HOW_STEPS.map((s) => (
          <Card
            key={s.key}
            className="rounded-2xl border border-primary/25 bg-background/70 shadow-sm"
          >
            <CardContent className={cn("flex items-center gap-4 p-6")}>
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <span className="text-lg font-extrabold">{s.number}</span>
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-foreground">
                  {t(`steps.${s.key}.title`)}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`steps.${s.key}.description`)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

