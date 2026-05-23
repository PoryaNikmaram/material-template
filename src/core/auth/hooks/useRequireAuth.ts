'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useCurrentUserQuery } from '@/core/auth/hooks/useCurrentUserQuery'
import { getAuthSnapshot } from '@/core/auth/state/auth.snapshot'
import { getAccessToken, getRefreshToken } from '@/core/auth/storage/auth.storage'

export const useRequireAuth = () => {
  const router = useRouter()
  const [isClientReady, setIsClientReady] = useState(false)
  const { data: user, isError, isFetching, isFetched } = useCurrentUserQuery()

  useEffect(() => {
    setIsClientReady(true)
  }, [])

  const hasToken = isClientReady && (Boolean(getAccessToken()) || Boolean(getRefreshToken()))

  useEffect(() => {
    if (!isClientReady) {
      return
    }

    if (!hasToken) {
      router.replace('/login')
    }
  }, [hasToken, isClientReady, router])

  const snapshot = isClientReady ? getAuthSnapshot() : null

  const isResolving =
    !isClientReady ||
    !hasToken ||
    (hasToken && (!snapshot?.isBootstrapped || isFetching || (!user && !isError && !isFetched)))

  const isAuthenticated = Boolean(hasToken && user && snapshot?.isAuthenticated)

  return {
    user,
    hasToken,
    isResolving,
    isAuthenticated,
    isError
  }
}
