import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { getErrorMessage } from '@/core/http-service/errors'
import { toastStore } from '@/core/toast/toastStore'

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

const notifyError = (error: unknown): void => {
  toastStore.show({
    message: getErrorMessage(error),
    severity: 'error'
  })
}

const handleGlobalQueryError = (error: unknown): void => {
  notifyError(error)
}

const handleGlobalMutationError = (error: unknown): void => {
  notifyError(error)
}

export const makeQueryClient = (): QueryClient => {
  const queryCache = new QueryCache({
    onError: handleGlobalQueryError
  })

  const mutationCache = new MutationCache({
    onError: handleGlobalMutationError
  })

  return new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        gcTime: TWENTY_FOUR_HOURS_MS,
        staleTime: 30 * 1000
      },
      mutations: {
        retry: false
      }
    }
  })
}
