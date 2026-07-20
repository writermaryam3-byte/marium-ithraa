import proxy from './tamerproxy'

export default proxy

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
