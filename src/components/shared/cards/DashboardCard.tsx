import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CardInfo } from '@/lib/types/types'
import { IconTrendingUp } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import LoadingCard from './LoadingCard'
import ErrorCard from './ErrorCard'

const DashboardCard = ({ card }: { card: CardInfo }) => {
    const t = useTranslations()

    if(card.isLoading)return <LoadingCard/>
    if(card.isErr)return <ErrorCard error={card.error!} />
    return (
        <Card key={card.title} className="@container/card">
            <CardHeader>
                <CardDescription>{card.description}</CardDescription>
                <CardTitle className="flex justify-between items-center w-full text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {card.isLoading ? (<Skeleton className="h-10 w-10 rounded-2xl" />
                    ) : card.title}
                    {card.icon && card.icon}
                </CardTitle>
                <CardAction>
                    {card.badage.exist && (<Badge variant="outline">
                        <IconTrendingUp />
                        +12.5%
                    </Badge>)}
                </CardAction>
            </CardHeader>
            {card.footer.exist && (<CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {t("Dashboard.cards.trendingUp")} <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                    {t("Dashboard.cards.last6Months")}
                </div>
            </CardFooter>)}
        </Card>
    )
}

export default DashboardCard