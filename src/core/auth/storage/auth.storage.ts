import type { LoginResponse, RefreshResponse } from '@/features/auth'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const EXPIRES_IN_KEY = 'expiresIn'

const isBrowser = (): boolean => typeof window !== 'undefined'

export const setAccessToken = (token: string): void => {
  if (isBrowser()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

export const getAccessToken = (): string | null => {
  if (!isBrowser()) {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const removeAccessToken = (): void => {
  if (isBrowser()) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

export const setRefreshToken = (token: string): void => {
  if (isBrowser()) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token)
  }
}

export const getRefreshToken = (): string | null => {
  if (!isBrowser()) {
    return null
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const removeRefreshToken = (): void => {
  if (isBrowser()) {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

export const setExpiresIn = (expiresIn: number): void => {
  if (isBrowser()) {
    window.localStorage.setItem(EXPIRES_IN_KEY, String(expiresIn))
  }
}

export const getExpiresIn = (): number | null => {
  if (!isBrowser()) {
    return null
  }

  const value = window.localStorage.getItem(EXPIRES_IN_KEY)

  if (!value) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

export const removeExpiresIn = (): void => {
  if (isBrowser()) {
    window.localStorage.removeItem(EXPIRES_IN_KEY)
  }
}

export const persistAuthTokens = (data: LoginResponse | RefreshResponse): void => {
  setAccessToken(data.accessToken)
  setRefreshToken(data.refreshToken)
  setExpiresIn(data.expiresIn)
}

export const clearAuthStorage = (): void => {
  removeAccessToken()
  removeRefreshToken()
  removeExpiresIn()
}
