import { queryClientRef } from '@/core/react-query/queryClientRef'
import { getAccessToken, getRefreshToken } from '@/core/auth/storage/auth.storage'
import { authQueryKeys } from '@/features/auth'
import type { AuthUser } from '@/features/auth'

export type AuthSnapshot = {
  isAuthenticated: boolean
  hasToken: boolean
  isBootstrapped: boolean
}

export const getAuthSnapshot = (): AuthSnapshot => {
  const hasAccessToken = Boolean(getAccessToken())
  const hasRefreshToken = Boolean(getRefreshToken())
  const hasToken = hasAccessToken || hasRefreshToken

  const queryClient = queryClientRef.get()
  const meQueryKey = authQueryKeys.me()
  const meQueryState = queryClient?.getQueryState(meQueryKey)
  const currentUser = queryClient?.getQueryData<AuthUser>(meQueryKey)

  const isBootstrapped =
    !hasAccessToken ||
    meQueryState?.fetchStatus === 'idle' ||
    meQueryState?.status === 'success' ||
    meQueryState?.status === 'error'

  const isAuthenticated = hasAccessToken && meQueryState?.status === 'success' && Boolean(currentUser)

  return {
    isAuthenticated,
    hasToken,
    isBootstrapped
  }
}
