'use client'

// React Imports
import { useState } from 'react'
import type { ReactNode } from 'react'

// Third-party Imports
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Lib Imports
import { makeQueryClient } from '@/core/react-query/queryClient'

type Props = {
  children: ReactNode
}

const ReactQueryProvider = ({ children }: Props) => {
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
      )}
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
