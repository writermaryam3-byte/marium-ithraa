'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Users, School, Lightbulb } from 'lucide-react'

// تعريف الأيقونات المناسبة لكل فئة من المستفيدين
const ICONS = {
  family: Users, // الأسرة
  institutions: School, // المدارس والمؤسسات
  providers: Lightbulb, // مقدمو الأنشطة
} as const

const BENEFICIARY_TONES = [
  {
    iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    borderHover: 'hover:border-purple-500/30',
  },
  {
    iconBg: 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
    borderHover: 'hover:border-pink-500/30',
  },
  {
    iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    borderHover: 'hover:border-indigo-500/30',
  },
]

// الـ Keys الخاصة بالبيانات لعرضها بشكل ديناميكي
const BENEFICIARIES_DATA = [
  { key: 'family', icon: 'family' },
  { key: 'institutions', icon: 'institutions' },
  { key: 'providers', icon: 'providers' },
] as const

export default function HomeBeneficiaries() {
  const t = useTranslations('landing.beneficiaries')

  return (
    <section className="app-container py-14 lg:py-20">
      {/* عنوان القسم */}
      <div className="text-start mb-10">
        <h2 className="text-2xl font-extrabold text-primary sm:text-3xl tracking-tight">
          {t('title')}
        </h2>
      </div>

      {/* شبكة العرض (Grid) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BENEFICIARIES_DATA.map((item, idx) => {
          const Icon = ICONS[item.icon]
          const tone = BENEFICIARY_TONES[idx] || BENEFICIARY_TONES[0]

          return (
            <Card
              key={item.key}
              className={cn(
                'group rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md',
                tone.borderHover,
              )}
            >
              <CardContent className="p-6 md:p-8 text-start flex flex-col h-full justify-between">
                <div>
                  {/* حاوية الأيقونة المميزة */}
                  <div
                    className={cn(
                      'grid size-12 place-items-center rounded-2xl shadow-sm mb-5 transition-transform duration-300 group-hover:scale-105',
                      tone.iconBg,
                    )}
                  >
                    <Icon className="size-6 animate-pulse-slow" />
                  </div>

                  {/* اسم فئة المستفيدين */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t(`items.${item.key}.title`)}
                  </h3>

                  {/* الوصف والشرح */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`items.${item.key}.description`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
