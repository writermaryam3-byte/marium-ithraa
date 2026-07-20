'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { getFriendlyApiErrorMessage } from '@/lib/helpers/apiErrorMessages'
import { searchParentsByPhone } from '@/features/children/api'
import type { ParentInfo } from '@/features/children/types/interfaces'

type ParentState = null | 'found' | 'creating' | 'not_parent'
type RequestState = 'idle' | 'loading' | 'success'

export function useParentSearch(phone: string) {
  const t = useTranslations('children.create')
  const normalizedPhone = useMemo(() => phone.trim(), [phone])
  const [parent, setParent] = useState<ParentInfo | null>(null)
  const [parentState, setParentState] = useState<ParentState>(null)
  const [requestState, setRequestState] = useState<RequestState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [notParentUser, setNotParentUser] = useState<{
    id: string
    name?: string
    phone: string
    email?: string
  } | null>(null)

  useEffect(() => {
    if (!normalizedPhone) return

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setRequestState('loading')
      setError(null)

      try {
        const result = await searchParentsByPhone(normalizedPhone)
        if (controller.signal.aborted) return

        if (result.status === 'parent_found') {
          setParent({
            ...result.parent,
            children: result.parent.children ?? result.children ?? [],
          })
          setParentState('found')
          setNotParentUser(null)
        } else if (result.status === 'not_parent') {
          setParent(null)
          setParentState('not_parent')
          setNotParentUser(result.user)
        } else {
          setParent(null)
          setParentState('creating')
          setNotParentUser(null)
        }
        setRequestState('success')
      } catch (err) {
        if (controller.signal.aborted) return

        setParent(null)
        setParentState(null)
        setRequestState('idle')
        setError(getFriendlyApiErrorMessage(err, t('toast.unableToSearchParent')))
      }
    }, 500)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [normalizedPhone, t])

  return {
    parent: normalizedPhone ? parent : null,
    parentState: normalizedPhone ? parentState : null,
    requestState: normalizedPhone ? requestState : 'idle',
    isSearching: normalizedPhone ? requestState === 'loading' : false,
    error: normalizedPhone ? error : null,
    notParentUser: normalizedPhone ? notParentUser : null,
  }
}

export type { ParentState, RequestState }
