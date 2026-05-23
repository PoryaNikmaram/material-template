import type { AxiosRequestConfig } from 'axios'

export type ApiEnvelope<T> = {
  data: T
  message?: string
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiBaseConfig = AxiosRequestConfig & {
  method?: HttpMethod
}
