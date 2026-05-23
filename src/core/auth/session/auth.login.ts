import type { QueryClient } from '@tanstack/react-query'

import { authDebug } from '@/core/auth/debug/auth.debug'
import { resetAuthBootstrap } from '@/core/auth/session/auth.bootstrap'
import { persistAuthTokens } from '@/core/auth/storage/auth.storage'
import { authQueryKeys } from '@/features/auth'
import type { LoginResponse } from '@/features/auth/types/auth.types'

export const completeLoginSession = async (data: LoginResponse, queryClient: QueryClient): Promise<void> => {
  persistAuthTokens(data)
  resetAuthBootstrap()
  authDebug.loginSuccess({ userId: data.user?.id })
  await queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
}
