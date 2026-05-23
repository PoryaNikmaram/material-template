import type { AxiosError } from 'axios'

import {
  createBadRequestError,
  createNetworkError,
  createNotFoundError,
  createServerError,
  createUnauthorizedError,
  createValidationError
} from './errorFactories'
import type { ApiError, ApiErrorPayload } from './errorTypes'

const mapValidationErrors = (payload?: ApiErrorPayload): Record<string, string[]> => {
  if (!payload?.errors?.length) {
    return {}
  }

  return payload.errors.reduce<Record<string, string[]>>((accumulator, item) => {
    const current = accumulator[item.field] ?? []

    accumulator[item.field] = [...current, item.message]

    return accumulator
  }, {})
}

const extractMessage = (payload: ApiErrorPayload | undefined, fallback: string): string => {
  return payload?.message?.trim() || fallback
}

export const resolveHttpError = (error: AxiosError<ApiErrorPayload>): ApiError => {
  if (!error.response) {
    return createNetworkError()
  }

  const statusCode = error.response.status
  const payload = error.response.data
  const validationErrors = mapValidationErrors(payload)

  if (statusCode === 400 && Object.keys(validationErrors).length > 0) {
    return createValidationError(extractMessage(payload, 'اطلاعات ارسالی معتبر نیست.'), validationErrors)
  }

  if (statusCode === 400) {
    return createBadRequestError(extractMessage(payload, 'درخواست نامعتبر است.'))
  }

  if (statusCode === 401) {
    return createUnauthorizedError(extractMessage(payload, 'لطفاً وارد حساب کاربری خود شوید.'))
  }

  if (statusCode === 403) {
    return createUnauthorizedError(extractMessage(payload, 'دسترسی به این عملیات مجاز نیست.'))
  }

  if (statusCode === 404) {
    return createNotFoundError(extractMessage(payload, 'منبع درخواستی یافت نشد.'))
  }

  if (statusCode >= 500) {
    return createServerError(extractMessage(payload, 'خطای داخلی سرور رخ داده است.'), statusCode)
  }

  return createBadRequestError(extractMessage(payload, 'درخواست نامعتبر است.'))
}
