const OPERATIONAL_ROUTE_PREFIXES = [
  '/dashboards/organization/grades',
  '/dashboards/organization/classes',
  '/dashboards/organization/children',
  '/dashboards/organization/teachers',
  '/dashboards/organization/employees',
  '/dashboards/organization/child-transfers',
  '/dashboards/organization/deals',
  '/dashboards/organization/results',
  '/dashboards/organization/attempts',
] as const

export function isOperationalOrganizationRoute(pathname: string): boolean {
  return OPERATIONAL_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function isOrganizationDashboardHome(pathname: string): boolean {
  return pathname === '/dashboards/organization' || pathname.endsWith('/dashboards/organization')
}
