import { create, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { authDebug } from '@/core/auth/debug/auth.debug'
import { getAccessToken } from '@/core/auth/storage/auth.storage'

import './axios-config.types'
import { resolveHttpError } from './errors/resolveHttpError'
import type { ApiErrorPayload } from './errors/errorTypes'

const resolveBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '/api'
}

export const axiosInstance = create({
  baseURL: resolveBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    authDebug.axiosRequest({
      url: config.url,
      method: config.method,
      skipAuthRefresh: Boolean(config._skipAuthRefresh),
      retry: Boolean(config._retry)
    })

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config

    if (error.response?.status === 403 && originalRequest) {
      authDebug.axios403SkipRefresh({
        url: originalRequest.url,
        skipAuthRefresh: Boolean(originalRequest._skipAuthRefresh)
      })
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._skipAuthRefresh &&
      !originalRequest._retry
    ) {
      authDebug.axios401Refresh({ url: originalRequest.url })
      originalRequest._retry = true

      const { refreshAuthTokens } = await import('@/core/auth/session/auth.refresh')
      const refreshed = await refreshAuthTokens()

      if (refreshed) {
        const accessToken = getAccessToken()

        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        authDebug.axiosRetry({ url: originalRequest.url })

        return axiosInstance(originalRequest)
      }
    }

    return Promise.reject(resolveHttpError(error))
  }
)

export default axiosInstance
