export type UserStatus = 'active' | 'inactive' | 'pending'

export type User = {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
  avatarSrc?: string
}

export type CreateUserPayload = {
  name: string
  email: string
  role: string
}

export type UpdateUserPayload = Partial<Pick<User, 'name' | 'email' | 'role' | 'status'>>
