'use client'

import { useEffect, useRef } from 'react'

import { queryClientRef } from '@/core/react-query/queryClientRef'
import { authDebug } from '@/core/auth/debug/auth.debug'
import { useCurrentUserQuery } from '@/core/auth/hooks/useCurrentUserQuery'
import { resetAuthBootstrap } from '@/core/auth/session/auth.bootstrap'
import { redirectToLogin } from '@/core/auth/session/auth.redirect'
import { clearAuthStorage, getAccessToken, getRefreshToken } from '@/core/auth/storage/auth.storage'
import { authQueryKeys } from '@/features/auth'

export const useAuthRecovery = () => {
  const hasRecoveredRef = useRef(false)
  const { isError, isFetched, isFetching } = useCurrentUserQuery()

  useEffect(() => {
    if (hasRecoveredRef.current || !isFetched || isFetching || !isError) {
      return
    }

    const hasToken = Boolean(getAccessToken()) || Boolean(getRefreshToken())

    if (!hasToken) {
      return
    }

    hasRecoveredRef.current = true
    authDebug.recoveryTriggered({ reason: 'me-query-failed-with-tokens' })

    clearAuthStorage()
    resetAuthBootstrap()

    const queryClient = queryClientRef.get()

    if (queryClient) {
      queryClient.removeQueries({ queryKey: authQueryKeys.all })
    }

    redirectToLogin()
  }, [isError, isFetched, isFetching])
}
