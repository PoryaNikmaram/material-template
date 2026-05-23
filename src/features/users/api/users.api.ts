import { usersRepository } from '@/features/users/api/repositories/users.repository'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserImportResult,
  UsersListParams,
  UsersListResult
} from '@/features/users/types/users.types'

export type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserApiResponse,
  UserImportResult,
  UserImportResultApiResponse,
  ImportRowError,
  UserPagedResult,
  UserPagedResultApiResponse,
  UserMutationRequest,
  UsersListParams,
  UsersListResult
} from '@/features/users/types/users.types'

export { USER_IMPORT_ALLOWED_EXTENSIONS } from '@/features/users/types/users.types'

export const getUsers = (params: UsersListParams = {}): Promise<UsersListResult> =>
  usersRepository.getList(params)

export const getUserById = (id: string): Promise<User> => usersRepository.getById(id)

export const createUser = (payload: CreateUserRequest): Promise<User> => usersRepository.create(payload)

export const updateUser = (id: string, payload: UpdateUserRequest): Promise<User> => usersRepository.update(id, payload)

export const deleteUser = (id: string): Promise<void> => usersRepository.remove(id)

export const importUsers = (file: File): Promise<UserImportResult> => usersRepository.import(file)

export { usersRepository }
