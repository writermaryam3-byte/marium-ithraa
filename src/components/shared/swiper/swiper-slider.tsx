"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

type SliderBreakpoints = NonNullable<React.ComponentProps<typeof Swiper>["breakpoints"]>

export type SwiperSliderProps<T> = {
  items: T[]
  renderItem: (item: T, idx: number) => React.ReactNode
  className?: string
  slideClassName?: string
  slidesPerView?: number
  spaceBetween?: number
  breakpoints?: SliderBreakpoints
  pagination?: boolean
  loop?: boolean
}

export function SwiperSlider<T>({
  items,
  renderItem,
  className,
  slideClassName,
  slidesPerView = 1,
  spaceBetween = 16,
  breakpoints,
  pagination = false,
  loop = false,
}: SwiperSliderProps<T>) {
  const swiperRef = React.useRef<SwiperType | null>(null)

  return (
    <div className={cn("relative", className)}>
      <Swiper
        modules={[Navigation, Pagination, A11y, Keyboard]}
        onSwiper={(s) => (swiperRef.current = s)}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        loop={loop}
        keyboard={{ enabled: true }}
        pagination={pagination ? { clickable: true } : false}
        className="pb-10"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={idx} className={cn("h-auto", slideClassName)}>
            {renderItem(item, idx)}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="pointer-events-auto shadow-sm"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="pointer-events-auto shadow-sm"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

