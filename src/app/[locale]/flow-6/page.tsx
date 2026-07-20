import { getTranslations } from 'next-intl/server'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { DiscoverChildIntelligenceCard } from '@/components/shared/cards/DiscoverChildIntelligenceCard'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Flow6Page({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('landing.flowCta')
  const dir = getTextDirection(locale)

  return (
    <main className="min-h-dvh pt-24 pb-16" dir={dir}>
      <div className="app-container flex justify-center">
        <DiscoverChildIntelligenceCard
          title={t('title')}
          description={t('description')}
          ctaLabel={t('ctaLabel')}
        />
      </div>
    </main>
  )
}
