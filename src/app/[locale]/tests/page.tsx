import { getTranslations } from 'next-intl/server'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import RequireRoles from '@/features/auth/components/RequireRoles'
import { Link } from '@/i18n/navigation'
import { UserRole } from '@/lib/types/enums'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TestsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('TestsPage')

  return (
    <RequireRoles allowed={[UserRole.PARENT]} redirectTo="/unauthorized" locale={locale}>
      <main
        className="app-container flex min-h-[60vh] items-center justify-center py-16"
        dir={getTextDirection(locale)}
      >
        <section className="max-w-xl space-y-4 rounded-2xl border border-border/60 bg-background p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
          <Link
            href="/dashboards/parent/evaluations"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            {t('openEvaluations')}
          </Link>
        </section>
      </main>
    </RequireRoles>
  )
}
