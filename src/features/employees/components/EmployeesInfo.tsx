import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { Employee } from '../types/interfaces'

const EmployeesInfo = ({ employee, initials }: { employee: Employee; initials: any }) => {
  const t = useTranslations('employees')

  return (
    <Card className="bg-linear-to-tr from-primary/5 to-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-primary/10 text-lg font-semibold">
            {initials || 'EM'}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-semibold">{employee.user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{employee.job_title}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground">{t('fields.email')}</p>
          <p className="text-sm font-medium">{employee.user.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground">{t('fields.phone')}</p>
          <p className="text-sm font-medium">{employee.user.phone}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground">{t('fields.role')}</p>
          <p className="text-sm font-medium">{employee.user.role}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground">{t('fields.job')}</p>
          <p className="text-sm font-medium">{employee.job_title}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployeesInfo
