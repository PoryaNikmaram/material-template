import { create, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

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
    if (typeof window !== 'undefined') {
      const accessToken = window.localStorage.getItem('accessToken')

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiErrorPayload>) => Promise.reject(resolveHttpError(error))
)

export default axiosInstance
