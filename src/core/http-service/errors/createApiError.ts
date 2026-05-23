import type { ApiError, ApiErrorCode } from './errorTypes'

type CreateApiErrorInput = {
  message: string
  statusCode: number
  code: ApiErrorCode
  detail?: string
  errors?: Record<string, string[]>
}

export const createApiError = (input: CreateApiErrorInput): ApiError => ({
  message: input.message,
  statusCode: input.statusCode,
  code: input.code,
  detail: input.detail,
  errors: input.errors
})

export const isApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  const candidate = error as Partial<ApiError>

  return (
    typeof candidate.message === 'string' &&
    typeof candidate.statusCode === 'number' &&
    typeof candidate.code === 'string'
  )
}

export const getErrorMessage = (error: unknown, fallback = 'خطا در انجام عملیات'): string => {
  if (isApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export const throwApiError = (error: ApiError): never => {
  throw error
}
