import { createApiError } from './createApiError'
import type { ApiError } from './errorTypes'

export const createBadRequestError = (message = 'درخواست نامعتبر است.'): ApiError =>
  createApiError({
    message,
    statusCode: 400,
    code: 'BAD_REQUEST'
  })

export const createValidationError = (
  message = 'اطلاعات ارسالی معتبر نیست.',
  errors: Record<string, string[]> = {}
): ApiError =>
  createApiError({
    message,
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    errors
  })

export const createUnauthorizedError = (message = 'دسترسی به این عملیات مجاز نیست.'): ApiError =>
  createApiError({
    message,
    statusCode: 403,
    code: 'UNAUTHORIZED'
  })

export const createNotFoundError = (message = 'منبع درخواستی یافت نشد.'): ApiError =>
  createApiError({
    message,
    statusCode: 404,
    code: 'NOT_FOUND'
  })

export const createNetworkError = (message = 'خطا در برقراری ارتباط با سرور.'): ApiError =>
  createApiError({
    message,
    statusCode: 0,
    code: 'NETWORK_ERROR'
  })

export const createServerError = (
  message = 'خطای داخلی سرور رخ داده است.',
  statusCode = 500
): ApiError =>
  createApiError({
    message,
    statusCode,
    code: 'SERVER_ERROR'
  })
