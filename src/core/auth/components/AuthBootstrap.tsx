'use client'

// React Imports
import { useEffect } from 'react'
import type { ReactNode } from 'react'

// Third-party Imports
import { useQueryClient } from '@tanstack/react-query'

// Core Imports
import { queryClientRef } from '@/core/react-query/queryClientRef'
import { useAuthRecovery } from '@/core/auth/hooks/useAuthRecovery'
import { ensureAuthBootstrap } from '@/core/auth/session/auth.bootstrap'

type AuthBootstrapProps = {
  children: ReactNode
}

const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClientRef.set(queryClient)

    return () => {
      queryClientRef.clear()
    }
  }, [queryClient])

  useAuthRecovery()

  useEffect(() => {
    void ensureAuthBootstrap(queryClient)
  }, [queryClient])

  return children
}

export default AuthBootstrap
