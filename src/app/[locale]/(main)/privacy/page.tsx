'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Shield,
  ShieldAlert,
  Eye,
  Lock,
  UserCheck,
  Scale,
  FileText,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'definitions', titleKey: 'sections.definitions.title', icon: FileText },
  { id: 'about', titleKey: 'sections.about.title', icon: HelpCircle },
  { id: 'audience', titleKey: 'sections.audience.title', icon: UserCheck },
  { id: 'data-collected', titleKey: 'sections.dataCollected.title', icon: Eye },
  { id: 'how-we-collect', titleKey: 'sections.processing.title', icon: Scale },
  { id: 'purposes', titleKey: 'sections.processing.title', icon: Lock },
  { id: 'rights', titleKey: 'sections.rights.title', icon: Shield },
  { id: 'complaints', titleKey: 'sections.complaints.title', icon: ShieldAlert },
]

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacy')
  const [activeSection, setActiveSection] = useState('definitions')

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const definitions = t.raw('sections.definitions.items') as { label: string; desc: string }[]
  const audienceItems = t.raw('sections.audience.items') as { title: string; desc: string }[]
  const rightsItems = t.raw('sections.rights.items') as { title: string; desc: string }[]
  const purposes = t.raw('purposes') as string[]
  const howItems = t.raw('sections.processing.howItems') as { strong: string; text: string }[]
  const parentsItems = t.raw('sections.dataCollected.parents.items') as string[]
  const providersItems = t.raw('sections.dataCollected.providers.items') as string[]
  const aboutLaw = t.raw('sections.about') as {
    title: string
    description: string
    legalName: { label: string; value: string }
    email: { label: string; value: string }
  }
  const dataTech = t.raw('sections.dataCollected.technical') as { title: string; desc: string }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-20 selection:bg-purple-500/20">
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pb-12 text-center app-container">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4 animate-fade-in">
          <Shield className="size-3.5" />
          {t('headerBadge')}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
          {t('headerTitle')}
        </h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('headerDesc')}
        </p>
      </div>

      <div className="app-container grid gap-8 lg:grid-cols-4 mt-8">
        <aside className="hidden lg:block lg:col-span-1 space-y-1 sticky top-24 h-fit max-vh-[80vh] overflow-y-auto pr-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            {t('sidebarLabel')}
          </div>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon
            const isActive = activeSection === sec.id
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-start',
                  isActive
                    ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold border-r-4 border-purple-500'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{t(sec.titleKey)}</span>
              </button>
            )
          })}
        </aside>

        <main className="col-span-1 lg:col-span-3 space-y-12">
          <section
            id="definitions"
            className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-purple-500" />
              {t('sections.definitions.title')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {definitions.map((def, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/40 border border-border/30">
                  <div className="font-bold text-foreground text-sm mb-1">{def.label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{def.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed">
              {t('sections.definitions.lawNote')}
            </div>
          </section>

          <section
            id="about"
            className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-4 border-b pb-3">
              <span className="size-2 rounded-full bg-pink-500" />
              {t('sections.about.title')}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {t('sections.about.description')}
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="bg-muted px-4 py-3 rounded-xl">
                <span className="text-muted-foreground block mb-0.5">
                  {t('sections.about.legalName.label')}
                </span>
                <strong className="text-foreground">{t('sections.about.legalName.value')}</strong>
              </div>
              <div className="bg-muted px-4 py-3 rounded-xl">
                <span className="text-muted-foreground block mb-0.5">
                  {t('sections.about.email.label')}
                </span>
                <a
                  href="mailto:privacy@ithrathaka.com"
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  {t('sections.about.email.value')}
                </a>
              </div>
            </div>
          </section>

          <section
            id="audience"
            className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-indigo-500" />
              {t('sections.audience.title')}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {audienceItems.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-5 rounded-2xl border',
                    i === 0
                      ? 'bg-purple-500/5 border-purple-500/10'
                      : i === 1
                        ? 'bg-pink-500/5 border-pink-500/10'
                        : 'bg-indigo-500/5 border-indigo-500/10',
                  )}
                >
                  <h3
                    className={cn(
                      'font-bold text-base mb-2',
                      i === 0
                        ? 'text-purple-700 dark:text-purple-400'
                        : i === 1
                          ? 'text-pink-700 dark:text-pink-400'
                          : 'text-indigo-700 dark:text-indigo-400',
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="data-collected"
            className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-fuchsia-500" />
              {t('sections.dataCollected.title')}
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground bg-muted/60 px-3 py-1.5 rounded-lg w-fit">
                  {t('sections.dataCollected.parents.title')}
                </h4>
                <ul className="grid gap-2 text-xs text-muted-foreground pr-4 list-disc">
                  {parentsItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground bg-muted/60 px-3 py-1.5 rounded-lg w-fit">
                  {t('sections.dataCollected.providers.title')}
                </h4>
                <ul className="grid gap-2 text-xs text-muted-foreground pr-4 list-disc">
                  {providersItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/10 text-xs">
                <strong className="text-foreground block mb-1">{dataTech.title}</strong>
                {dataTech.desc}
              </div>
            </div>
          </section>

          <section
            id="how-we-collect"
            className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-violet-500" />
              {t('sections.processing.title')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">
                  {t('sections.processing.howTitle')}
                </h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {howItems.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <ChevronLeft className="size-4 text-purple-500 shrink-0" />{' '}
                      <span>
                        <strong>{item.strong}</strong> {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">
                  {t('sections.processing.purposeTitle')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {purposes.map((purpose, idx) => (
                    <span
                      key={idx}
                      className="bg-muted px-2.5 py-1 rounded-md text-xs text-muted-foreground"
                    >
                      {purpose}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id="rights"
            className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-rose-500" />
              {t('sections.rights.title')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {t('sections.rights.description')}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {rightsItems.map((right, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10"
                >
                  <div className="size-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground mb-0.5">{right.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{right.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 text-xs text-center text-muted-foreground bg-muted p-3 rounded-xl">
              {t('sections.rights.contact', { email: t('sections.about.email.value') })}
            </div>
          </section>

          <section
            id="complaints"
            className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-4 border-b pb-3">
              <span className="size-2 rounded-full bg-red-500" />
              {t('sections.complaints.title')}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {t('sections.complaints.description')}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="p-4 rounded-xl bg-muted/50 border">
                <span className="text-xs text-muted-foreground block mb-1">
                  {t('sections.complaints.complaintsEmail.label')}
                </span>
                <strong className="text-foreground">
                  {t('sections.complaints.complaintsEmail.value')}
                </strong>
                <span className="text-xs block text-purple-600 dark:text-purple-400 mt-1">
                  {t('sections.complaints.complaintsEmail.responseTime')}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border">
                <span className="text-xs text-muted-foreground block mb-1">
                  {t('sections.complaints.generalEmail.label')}
                </span>
                <strong className="text-foreground">
                  {t('sections.complaints.generalEmail.value')}
                </strong>
                <span className="text-xs block text-muted-foreground mt-1">
                  {t('sections.complaints.generalEmail.website')}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
