import { createData, deleteData, readData, updateData } from '@/core/http-service/http-service'

import type { CreateUserPayload, UpdateUserPayload, User } from '@/features/users/types/users.types'

const USERS_ENDPOINT = '/users'

export const usersRepository = {
  getAll: (): Promise<User[]> => readData<User[]>(USERS_ENDPOINT),

  getById: (id: string): Promise<User> => readData<User>(`${USERS_ENDPOINT}/${id}`),

  create: (payload: CreateUserPayload): Promise<User> =>
    createData<CreateUserPayload, User>(USERS_ENDPOINT, payload),

  update: (id: string, payload: UpdateUserPayload): Promise<User> =>
    updateData<UpdateUserPayload, User>(`${USERS_ENDPOINT}/${id}`, payload),

  remove: (id: string): Promise<void> => deleteData(`${USERS_ENDPOINT}/${id}`)
} as const
