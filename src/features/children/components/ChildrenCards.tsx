'use client'

import { TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
type CardInfo = {
  description: string
  title: string
  badage: {
    exist: boolean
  }
  footer: {
    exist: boolean
  }
}
export function ChildrenCards({ cards }: { cards: CardInfo[] }) {
  const t = useTranslations()
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => (
        <Card key={card.title} className="@container/card">
          <CardHeader>
            <CardDescription>{t(card.description)}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.title}
            </CardTitle>
            <CardAction>
              {card.badage.exist && (
                <Badge variant="outline">
                  <TrendingUp />
                  +12.5%
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          {card.footer.exist && (
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {t('Dashboard.cards.trendingUp')} <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">{t('Dashboard.cards.last6Months')}</div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
