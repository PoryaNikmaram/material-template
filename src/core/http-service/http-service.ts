import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import { axiosInstance } from './axios-instance'
import type { ApiBaseConfig, ApiEnvelope } from './types'

const unwrapResponse = <T>(response: AxiosResponse<ApiEnvelope<T> | T>): T => {
  const payload = response.data

  if (payload !== null && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data
  }

  return payload as T
}

export const apiBase = async <T>(config: ApiBaseConfig): Promise<T> => {
  const response = await axiosInstance.request<ApiEnvelope<T> | T>(config)

  return unwrapResponse<T>(response)
}

export const readData = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiBase<T>({
    ...config,
    method: 'GET',
    url
  })
}

export const createData = async <TModel, TResult>(
  url: string,
  model: TModel,
  config?: AxiosRequestConfig
): Promise<TResult> => {
  return apiBase<TResult>({
    ...config,
    method: 'POST',
    url,
    data: model
  })
}

export const updateData = async <TModel, TResult>(
  url: string,
  model: TModel,
  config?: AxiosRequestConfig
): Promise<TResult> => {
  return apiBase<TResult>({
    ...config,
    method: 'PATCH',
    url,
    data: model
  })
}

export const deleteData = async (url: string, config?: AxiosRequestConfig): Promise<void> => {
  await apiBase<void>({
    ...config,
    method: 'DELETE',
    url
  })
}
