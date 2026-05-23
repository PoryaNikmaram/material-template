import { queryClientRef } from '@/core/react-query/queryClientRef'
import { authQueryKeys } from '@/features/auth'
import type { AuthUser } from '@/features/auth/types/auth.types'

export const hasRole = (user: AuthUser | null | undefined, allowedRoles: string[]): boolean => {
  if (!user?.role) {
    return false
  }

  return allowedRoles.includes(user.role)
}

export const hasRoleFromCache = (allowedRoles: string[]): boolean => {
  const queryClient = queryClientRef.get()
  const currentUser = queryClient?.getQueryData<AuthUser>(authQueryKeys.me())

  return hasRole(currentUser, allowedRoles)
}
