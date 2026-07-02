import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const LoadingCard = () => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>
          <Skeleton className="h-4 w-[200px]" />
        </CardDescription>
        <CardTitle className="flex justify-between items-center w-full text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          <Skeleton className="h-4 w-[100px]" />

          <Skeleton className="h-12 w-12 rounded-full" />
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

export default LoadingCard
