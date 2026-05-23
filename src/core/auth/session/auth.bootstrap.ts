import type { QueryClient } from '@tanstack/react-query'

import { authDebug } from '@/core/auth/debug/auth.debug'
import { getCurrentUser } from '@/features/auth'
import { authQueryKeys } from '@/features/auth'
import { getAccessToken } from '@/core/auth/storage/auth.storage'

const BOOTSTRAP_STALE_TIME_MS = 5 * 60 * 1000

let bootstrapPromise: Promise<unknown> | null = null
let hasBootstrappedSession = false

export const ensureAuthBootstrap = async (queryClient: QueryClient): Promise<void> => {
  if (!getAccessToken()) {
    hasBootstrappedSession = false

    return
  }

  if (hasBootstrappedSession) {
    authDebug.bootstrapSkip({ reason: 'session-already-bootstrapped' })

    return
  }

  if (bootstrapPromise) {
    authDebug.bootstrapSkip({ reason: 'bootstrap-in-flight' })
    await bootstrapPromise

    return
  }

  authDebug.bootstrapStart()

  bootstrapPromise = queryClient
    .fetchQuery({
      queryKey: authQueryKeys.me(),
      queryFn: getCurrentUser,
      staleTime: BOOTSTRAP_STALE_TIME_MS,
      retry: false
    })
    .then(() => {
      hasBootstrappedSession = true
    })
    .finally(() => {
      bootstrapPromise = null
      authDebug.bootstrapComplete()
    })

  await bootstrapPromise
}

export const resetAuthBootstrap = (): void => {
  hasBootstrappedSession = false
  bootstrapPromise = null
}
