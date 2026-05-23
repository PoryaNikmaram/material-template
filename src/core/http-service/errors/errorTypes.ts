export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'

export type ApiError = {
  message: string
  statusCode: number
  code: ApiErrorCode
  detail?: string
  errors?: Record<string, string[]>
}

export type ApiErrorPayload = {
  message?: string
  detail?: string
  errors?: Array<{ field: string; message: string }>
}
