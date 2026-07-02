import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type DiscoverChildIntelligenceCardProps = {
  title: string
  description: string
  ctaLabel: string
  onCtaClick?: () => void
  className?: string
}

const imgMindMap = 'https://www.figma.com/api/mcp/asset/521a28a5-45f8-4d5c-a99c-9363e980640e'
const imgPaintbrush = 'https://www.figma.com/api/mcp/asset/5357d317-2f7f-403f-a38b-e29851284e5e'

export function DiscoverChildIntelligenceCard({
  title,
  description,
  ctaLabel,
  onCtaClick,
  className,
}: DiscoverChildIntelligenceCardProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[12px] bg-brand-purple text-white',
        // Match design size while still responsive
        'w-full max-w-[413px] min-h-[254px]',
        className,
      )}
      aria-label={title}
    >
      {/* Decorative icons */}
      <div
        className="pointer-events-none absolute start-[83px] top-0 h-[38px] w-[38px]"
        aria-hidden="true"
      >
        <Image src={imgMindMap} alt="" fill sizes="38px" />
      </div>

      <div
        className="pointer-events-none absolute start-[19px] top-0 h-[45.324px] w-[45.324px]"
        aria-hidden="true"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="rotate-[-26.95deg]">
            <div className="relative h-[33.708px] w-[33.708px]">
              <Image src={imgPaintbrush} alt="" fill sizes="34px" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute end-[16px] top-[16px] h-[38px] w-[38px]"
        aria-hidden="true"
      >
        <Image src={imgMindMap} alt="" fill sizes="38px" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[16px] px-6 text-center">
        <div className="flex w-full max-w-[286px] flex-col items-center gap-[8px]">
          <h3 className="text-[24px] font-bold leading-[1.6]" dir="auto">
            {title}
          </h3>
          <p className="text-[16px] font-bold leading-[1.6] text-white/95" dir="auto">
            {description}
          </p>
        </div>

        <Button
          type="button"
          onClick={onCtaClick}
          className="h-[38px] w-[123px] rounded-[12px] bg-[#391172] text-[16px] font-bold leading-[1.6] text-white hover:bg-[#2f0e5f] focus-visible:ring-white/40"
        >
          {ctaLabel}
        </Button>
      </div>
    </section>
  )
}
