import { apiBase, createData, deleteData, putData, readData } from '@/core/http-service/http-service'

import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserImportResult,
  UserPagedResult,
  UsersListParams
} from '@/features/users/types/users.types'

const USERS_ENDPOINT = '/v1/users'

export const usersRepository = {
  getList: (params: UsersListParams = {}): Promise<UserPagedResult> => {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const search = params.search?.trim()

    let url = `${USERS_ENDPOINT}?page=${page}&pageSize=${pageSize}`

    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }

    return readData<UserPagedResult>(url)
  },

  getById: (id: string): Promise<User> => readData<User>(`${USERS_ENDPOINT}/${id}`),

  create: (payload: CreateUserRequest): Promise<User> => createData<CreateUserRequest, User>(USERS_ENDPOINT, payload),

  update: (id: string, payload: UpdateUserRequest): Promise<User> =>
    putData<UpdateUserRequest, User>(`${USERS_ENDPOINT}/${id}`, payload),

  remove: (id: string): Promise<void> => deleteData(`${USERS_ENDPOINT}/${id}`),

  import: (file: File): Promise<UserImportResult> => {
    const formData = new FormData()

    formData.append('file', file)

    return apiBase<UserImportResult>({
      method: 'POST',
      url: `${USERS_ENDPOINT}/import`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
} as const
