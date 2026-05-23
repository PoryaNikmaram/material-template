import type { ApiEnvelope } from '@/core/http-service/types'

export type User = {
  id: string
  nationalId: string | null
  firstName: string | null
  lastName: string | null
  job: string | null
  address: string | null
  phoneNumber: string | null
  fatherName: string | null
  officeNumber: string | null
  bankAccountNumber: string | null
  registrationNumber: string | null
  description: string | null
  email: string | null
  username: string | null
  role: string | null
  isActive: boolean
}

export type UserPagedResult = {
  items: User[] | null
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type CreateUserRequest = {
  nationalId?: string | null
  firstName?: string | null
  lastName?: string | null
  job?: string | null
  password?: string | null
  address?: string | null
  phoneNumber?: string | null
  fatherName?: string | null
  officeNumber?: string | null
  bankAccountNumber?: string | null
  registrationNumber?: string | null
  description?: string | null
  email?: string | null
  username?: string | null
  role?: string | null
  isActive?: boolean | null
}

export type UpdateUserRequest = CreateUserRequest

export type UsersListParams = {
  page?: number
  pageSize?: number
  search?: string
}

export type UserApiResponse = ApiEnvelope<User>
export type UserPagedResultApiResponse = ApiEnvelope<UserPagedResult>
export type UserMutationRequest = CreateUserRequest | UpdateUserRequest
export type UsersListResult = UserPagedResult

export type ImportRowError = {
  row: number
  nationalId: string | null
  message: string | null
}

export type UserImportResult = {
  createdCount: number
  skippedCount: number
  errors: ImportRowError[] | null
}

export type UserImportResultApiResponse = ApiEnvelope<UserImportResult>

export const USER_IMPORT_ALLOWED_EXTENSIONS = ['.xlsx', '.xls'] as const
