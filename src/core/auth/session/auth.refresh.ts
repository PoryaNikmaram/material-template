import type { AxiosResponse } from 'axios'

import { queryClientRef } from '@/core/react-query/queryClientRef'
import { axiosInstance } from '@/core/http-service/axios-instance'
import '@/core/http-service/axios-config.types'
import type { ApiEnvelope } from '@/core/http-service/types'
import { authDebug } from '@/core/auth/debug/auth.debug'
import { resetAuthBootstrap } from '@/core/auth/session/auth.bootstrap'
import { redirectToLogin } from '@/core/auth/session/auth.redirect'
import { clearAuthStorage, getRefreshToken, persistAuthTokens } from '@/core/auth/storage/auth.storage'
import { authQueryKeys } from '@/features/auth'
import type { RefreshResponse } from '@/features/auth'

const AUTH_REFRESH_ENDPOINT = '/v1/auth/refresh'

let refreshPromise: Promise<boolean> | null = null

const unwrapResponse = <T>(response: AxiosResponse<ApiEnvelope<T> | T>): T => {
  const payload = response.data

  if (payload !== null && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data
  }

  return payload as T
}

const handleRefreshFailure = (): void => {
  authDebug.refreshFailure()
  clearAuthStorage()
  resetAuthBootstrap()

  const client = queryClientRef.get()

  if (client) {
    client.removeQueries({ queryKey: authQueryKeys.all })
  }

  redirectToLogin()
}

const executeRefresh = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    authDebug.missingTokens({ context: 'refresh' })
    handleRefreshFailure()

    return false
  }

  authDebug.refreshStart()

  try {
    const response = await axiosInstance.post<ApiEnvelope<RefreshResponse>>(
      AUTH_REFRESH_ENDPOINT,
      { refreshToken },
      { _skipAuthRefresh: true }
    )

    persistAuthTokens(unwrapResponse<RefreshResponse>(response))
    authDebug.refreshSuccess()

    return true
  } catch {
    handleRefreshFailure()

    return false
  }
}

export const refreshAuthTokens = (): Promise<boolean> => {
  if (refreshPromise) {
    authDebug.refreshReuse()

    return refreshPromise
  }

  refreshPromise = executeRefresh().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}
