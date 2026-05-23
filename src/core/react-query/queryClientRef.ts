import type { QueryClient } from '@tanstack/react-query'

let queryClient: QueryClient | null = null

export const queryClientRef = {
  set: (client: QueryClient): void => {
    queryClient = client
  },

  get: (): QueryClient | null => queryClient,

  clear: (): void => {
    queryClient = null
  }
}
