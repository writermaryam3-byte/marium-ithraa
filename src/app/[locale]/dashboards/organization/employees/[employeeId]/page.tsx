import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { getEmployeeById } from "@/features/employees"

type PageProps = {
  params: {
    locale: string
    employeeId: string
  }
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const res = await getEmployeeById(params.employeeId)

  if (!res.ok) {
    throw new Error("Failed to load employee")
  }

  const employee = await res.json()

  const initials = employee.user.name
    ?.split(" ")
    .map((part: string) => part[0])
    .join("")
    .toUpperCase()

  return (
    <>
      <SiteHeader title="Employee Details" />
      <div className="flex flex-1 flex-col px-4 py-6 lg:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <Card className="bg-linear-to-tr from-primary/5 to-card shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold">
                  {initials || "EM"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-semibold">
                  {employee.user.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {employee.job_title}
                </p>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{employee.user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{employee.user.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

