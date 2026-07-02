'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { HOME_FEATURES } from '@/lib/home.constants'
import { Card, CardContent } from '@/components/ui/card'
import {
  BarChart3,
  Sparkles,
  Brain,
  FileText,
  LayoutDashboard,
  ClipboardCheck,
  Award,
  TrendingUp,
} from 'lucide-react'

const ICONS = {
  brain: Brain,
  barChart: BarChart3,
  sparkles: Sparkles,
  FileText: FileText,
  LayoutDashboard: LayoutDashboard,
  ClipboardCheck: ClipboardCheck,
  Award: Award,
  Brain: Brain,
  TrendingUp: TrendingUp,
} as const

const tones = [
  'bg-purple-500/15 text-purple-700 dark:text-purple-300', // العنصر 0 - بنفسجي الهوية الأساسي
  'bg-pink-500/15 text-pink-700 dark:text-pink-300', // العنصر 1 - وردي مبهج
  'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300', // العنصر 2 - كحلي/إنديغو يميل للبنفسجي
  'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300', // العنصر 3 - فوشيا ناعم
  'bg-violet-500/15 text-violet-700 dark:text-violet-300', // العنصر 4 - درجة فيوليت مكملة
  'bg-rose-500/15 text-rose-700 dark:text-rose-300', // العنصر 5 - روز دافئ
]

export default function HomeFeatures() {
  const t = useTranslations('HomePage.Features')

  return (
    <section className="app-container py-14 lg:py-20">
      <div className="text-start">
        <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">{t('title')}</h2>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {HOME_FEATURES.map((f, idx) => {
          const Icon = ICONS[f.icon]
          const tone = tones[idx] || 'bg-purple-500/15 text-purple-700'

          return (
            <Card key={f.key} className={cn('rounded-2xl border border-border/60 shadow-sm', tone)}>
              <CardContent className="p-6 text-start">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-background/60 text-primary shadow-sm">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-foreground">
                      {t(`items.${f.key}.title`)}
                    </div>
                    {/* <div className="mt-1 text-sm text-muted-foreground">
                      {t(`items.${f.key}.description`)}
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
