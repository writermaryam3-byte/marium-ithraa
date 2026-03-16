"use client"
import { SessionProvider as NextSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

const SessionProvider = ({children}: {children: ReactNode}) => {
  return (
    <NextSessionProvider>
        {children}
    </NextSessionProvider>
  )
}

export default SessionProvider