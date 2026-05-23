'use client'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { getAccessToken } from '@/core/auth/storage/auth.storage'
import { authQueryKeys } from '@/features/auth'

const CURRENT_USER_STALE_TIME_MS = 5 * 60 * 1000

export const useCurrentUserQuery = () => {
  const [isClientReady, setIsClientReady] = useState(false)

  useEffect(() => {
    setIsClientReady(true)
  }, [])

  const hasAccessToken = isClientReady && Boolean(getAccessToken())

  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      const { getCurrentUser } = await import('@/features/auth')

      return getCurrentUser()
    },
    enabled: hasAccessToken,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: CURRENT_USER_STALE_TIME_MS
  })
}
