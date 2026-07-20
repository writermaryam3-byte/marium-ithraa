import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'errors.unauthorized' })
  return { title: t('title') }
}

export default async function UnauthorizedPage() {
  const t = await getTranslations('errors.unauthorized')

  return (
    <main className="app-container flex min-h-[60vh] items-center justify-center py-16">
      <section className="max-w-md space-y-4 rounded-2xl border border-border/60 bg-background p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
        <Link
          href={`/${Routes.AUTH}/${Pages.LOGIN}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {t('goHome')}
        </Link>
      </section>
    </main>
  )
}
