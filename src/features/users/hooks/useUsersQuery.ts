'use client'

import { useQuery } from '@tanstack/react-query'

import { getUserById, getUsers } from '@/features/users/api/users.api'
import { usersQueryKeys } from '@/features/users/api/queryKeys'
import type { UsersListParams } from '@/features/users/types/users.types'

export const useUsersListQuery = (params: UsersListParams) => {
  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => getUsers(params)
  })
}

export const useUserQuery = (id?: string) => {
  return useQuery({
    queryKey: usersQueryKeys.detail(id ?? ''),
    queryFn: () => getUserById(id!),
    enabled: Boolean(id)
  })
}
