'use client'

import { Button } from '@/components/ui/button'
import 'flag-icons/css/flag-icons.min.css'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('navigation.header')

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full overflow-hidden"
          aria-label={t('language')}
        >
          <div className="relative size-6">
            {locale === 'ar' ? (
              <span className="fi fi-sa"></span>
            ) : (
              <span className="fi fi-us"></span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale('en')}>
          <div className="flex items-center gap-2">
            <span className="fi fi-us w-[18px] h-[18px]"></span>
            {t('languageEnglish')}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale('ar')}>
          <div className="flex items-center gap-2">
            <span className="fi fi-sa w-[18px] h-[18px]"></span>
            {t('languageArabic')}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
