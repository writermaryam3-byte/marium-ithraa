import dynamic from 'next/dynamic'

export const SwiperSlider = dynamic(
  () => import('./swiper-slider-client').then((mod) => mod.SwiperSlider),
  { ssr: false },
)
