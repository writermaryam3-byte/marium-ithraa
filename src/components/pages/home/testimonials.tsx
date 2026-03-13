"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { HOME_TESTIMONIALS } from "@/lib/home.constants"
import { Card, CardContent } from "@/components/ui/card"
import { SwiperSlider } from "@/components/shared/swiper/swiper-slider"

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "text-sm",
            i < value ? "text-amber-400" : "text-muted-foreground/30"
          )}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function HomeTestimonials() {
  const locale = useLocale()
  const t = useTranslations("HomePage.Testimonials")
  const isRtl = locale === "ar"

  return (
    <section className="app-container pb-16 lg:pb-24">
      <div className={cn(isRtl ? "text-right" : "text-left")}>
        <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">
          {t("title")}
        </h2>
      </div>

      <div className="mt-8">
        <SwiperSlider
          items={HOME_TESTIMONIALS}
          loop
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 18 },
          }}
          renderItem={(item) => (
            <Card className="h-full rounded-2xl border border-border/60 bg-[#131E430A] shadow-sm">
              <CardContent className="p-6">
                <div className={cn("flex items-start gap-3")}>
                  <Image
                    src={item.avatarSrc}
                    alt={t("avatarAlt")}
                    width={48}
                    height={48}
                    className="size-12 rounded-full border border-border/60"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-bold text-foreground">
                        {t(`items.${item.key}.name`)}
                      </div>
                      <Stars value={item.rating} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {t(`items.${item.key}.role`)}
                    </div>
                  </div>
                </div>

                <p className={cn("mt-4 text-sm leading-relaxed text-muted-foreground")}>
                  {t(`items.${item.key}.quote`)}
                </p>
              </CardContent>
            </Card>
          )}
        />
      </div>
    </section>
  )
}

