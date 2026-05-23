import type { QueryClient } from '@tanstack/react-query'

import { authDebug } from '@/core/auth/debug/auth.debug'
import { resetAuthBootstrap } from '@/core/auth/session/auth.bootstrap'
import { redirectToLogin } from '@/core/auth/session/auth.redirect'
import { clearAuthStorage, getRefreshToken } from '@/core/auth/storage/auth.storage'
import { logout, authQueryKeys } from '@/features/auth'

export const logoutSession = async (queryClient: QueryClient): Promise<void> => {
  authDebug.logoutStart()

  const refreshToken = getRefreshToken()

  if (refreshToken) {
    try {
      await logout({ refreshToken })
    } catch {
      // Frontend logout must succeed even when API logout fails.
    }
  }

  clearAuthStorage()
  resetAuthBootstrap()
  queryClient.removeQueries({ queryKey: authQueryKeys.all })
  authDebug.logoutComplete({ snapshot: 'cleared' })
  redirectToLogin()
}
