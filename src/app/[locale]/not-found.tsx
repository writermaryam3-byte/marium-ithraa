import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('errors.pageNotFound')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
      <p className="text-muted-foreground">{t('description')}</p>
      <Link href="/" className="text-sm underline underline-offset-4 hover:text-primary">
        {t('cta')}
      </Link>
    </div>
  )
}
