import { isMockApiEnabled } from '@/core/api/config'
import * as usersMock from '@/features/users/api/mock/users.mock'
import { usersRepository } from '@/features/users/api/repositories/users.repository'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/features/users/types/users.types'

export type { CreateUserPayload, UpdateUserPayload, User, UserStatus } from '@/features/users/types/users.types'

const repository = isMockApiEnabled() ? usersMock : usersRepository

export const getUsers = (): Promise<User[]> => repository.getAll()

export const getUserById = (id: string): Promise<User> => repository.getById(id)

export const createUser = (payload: CreateUserPayload): Promise<User> => repository.create(payload)

export const updateUser = (id: string, payload: UpdateUserPayload): Promise<User> =>
  repository.update(id, payload)

export const deleteUser = (id: string): Promise<void> => repository.remove(id)

export { usersRepository }
