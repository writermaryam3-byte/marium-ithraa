'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import {
  Brain,
  Users,
  School,
  Lightbulb,
  Target,
  Sparkles,
  Compass,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AboutPage() {
  const t = useTranslations('About')

  const stats = [
    {
      value: t('stats.children.value'),
      label: t('stats.children.label'),
      icon: Brain,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      value: t('stats.families.value'),
      label: t('stats.families.label'),
      icon: Users,
      color: 'text-pink-600 dark:text-pink-400',
    },
    {
      value: t('stats.partners.value'),
      label: t('stats.partners.label'),
      icon: School,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ]

  const pillars = [
    {
      title: t('system.pillars.0.title'),
      desc: t('system.pillars.0.desc'),
      icon: Users,
      bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    },
    {
      title: t('system.pillars.1.title'),
      desc: t('system.pillars.1.desc'),
      icon: School,
      bg: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
    },
    {
      title: t('system.pillars.2.title'),
      desc: t('system.pillars.2.desc'),
      icon: Lightbulb,
      bg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-20 overflow-hidden">
      <section className="relative app-container text-center pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4">
          <Sparkles className="size-3.5 animate-spin-slow" />
          {t('badge')}
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight max-w-3xl mx-auto leading-tight">
          {t('title')}
        </h1>

        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
          {t('description')}
        </p>
      </section>

      <section className="bg-muted/40 border-y border-border/60 py-10 my-6">
        <div className="app-container grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div className={cn('p-3 rounded-2xl bg-background shadow-sm', stat.color)}>
                  <Icon className="size-6" />
                </div>
                <div className="text-3xl font-black tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="app-container py-14 lg:py-20 grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6 text-start">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
            <Target className="size-4" />
            {t('vision.badge')}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary">{t('vision.title')}</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t('vision.p1')}
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t('vision.p2')}
          </p>
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-sm font-semibold text-indigo-900 dark:text-indigo-300 flex gap-3 items-center">
            <Compass className="size-5 text-indigo-500 shrink-0 animate-pulse" />
            <span>{t('vision.callout')}</span>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 relative">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl -z-10" />

          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
            <CheckCircle2 className="size-5 text-purple-500" />
            {t('system.title')}
          </h3>

          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4">
            {t('system.description')}
          </p>

          <div className="space-y-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors text-start"
                >
                  <div
                    className={cn(
                      'grid size-10 place-items-center rounded-xl shrink-0 shadow-sm',
                      pillar.bg,
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground mb-1">{pillar.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="app-container text-center pt-8">
        <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/10">
          <p className="text-sm md:text-base font-bold text-primary leading-relaxed">
            {t('footer')}
          </p>
        </div>
      </section>
    </div>
  )
}
