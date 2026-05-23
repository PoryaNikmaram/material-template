'use client'

import type { ReactNode } from 'react'

import AuthGuardLoader from '@/core/auth/components/AuthGuardLoader'
import { useRequireAuth } from '@/core/auth/hooks/useRequireAuth'

type RequireAuthProps = {
  children: ReactNode
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isResolving, isAuthenticated } = useRequireAuth()

  if (isResolving || !isAuthenticated) {
    return <AuthGuardLoader />
  }

  return children
}

export default RequireAuth
