import { createNotFoundError, createServerError, throwApiError } from '@/core/http-service/errors'

import type { CreateUserPayload, UpdateUserPayload, User } from '@/features/users/types/users.types'

const initialUsers: User[] = [
  {
    id: '1',
    name: 'علی رضایی',
    email: 'ali.rezaei@arasoft.ir',
    role: 'مدیر سیستم',
    status: 'active',
    avatarSrc: '/images/avatars/1.png'
  },
  {
    id: '2',
    name: 'مریم احمدی',
    email: 'maryam.ahmadi@arasoft.ir',
    role: 'تحلیل‌گر',
    status: 'active',
    avatarSrc: '/images/avatars/2.png'
  },
  {
    id: '3',
    name: 'امیر حسینی',
    email: 'amir.hosseini@arasoft.ir',
    role: 'توسعه‌دهنده',
    status: 'active',
    avatarSrc: '/images/avatars/3.png'
  },
  {
    id: '4',
    name: 'سارا موسوی',
    email: 'sara.mousavi@arasoft.ir',
    role: 'تحلیل‌گر',
    status: 'inactive',
    avatarSrc: '/images/avatars/4.png'
  },
  {
    id: '5',
    name: 'رضا نوری',
    email: 'reza.nouri@arasoft.ir',
    role: 'پشتیبان',
    status: 'active',
    avatarSrc: '/images/avatars/5.png'
  },
  {
    id: '6',
    name: 'نرگس صادقی',
    email: 'narges.sadghi@arasoft.ir',
    role: 'تحلیل‌گر',
    status: 'active',
    avatarSrc: '/images/avatars/6.png'
  },
  {
    id: '7',
    name: 'حسین کریمی',
    email: 'hossein.karimi@arasoft.ir',
    role: 'توسعه‌دهنده',
    status: 'pending',
    avatarSrc: '/images/avatars/7.png'
  },
  {
    id: '8',
    name: 'لیلا محمدی',
    email: 'leila.mohammadi@arasoft.ir',
    role: 'پشتیبان',
    status: 'active',
    avatarSrc: '/images/avatars/8.png'
  }
]

let usersStore: User[] = [...initialUsers]

const randomDelay = () => 500 + Math.floor(Math.random() * 701)

const delay = (ms?: number) => new Promise<void>(resolve => setTimeout(resolve, ms ?? randomDelay()))

const maybeFail = (message = 'عملیات با خطا مواجه شد. لطفاً دوباره تلاش کنید.') => {
  if (Math.random() < 0.2) {
    throwApiError(createServerError(message))
  }
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const getAll = async (): Promise<User[]> => {
  await delay()

  return [...usersStore]
}

export const getById = async (id: string): Promise<User> => {
  await delay()
  const user = usersStore.find(item => item.id === id)

  if (!user) {
    return throwApiError(createNotFoundError('کاربر یافت نشد.'))
  }

  return user
}

export const create = async (payload: CreateUserPayload): Promise<User> => {
  await delay()
  maybeFail('ایجاد کاربر انجام نشد.')

  const newUser: User = {
    id: generateId(),
    ...payload,
    status: 'pending',
    avatarSrc: `/images/avatars/${(usersStore.length % 8) + 1}.png`
  }

  usersStore = [newUser, ...usersStore]

  return newUser
}

export const update = async (id: string, payload: UpdateUserPayload): Promise<User> => {
  await delay()
  maybeFail('به‌روزرسانی کاربر انجام نشد.')

  const index = usersStore.findIndex(user => user.id === id)

  if (index === -1) {
    return throwApiError(createNotFoundError('کاربر یافت نشد.'))
  }

  const updatedUser = { ...usersStore[index], ...payload }

  usersStore[index] = updatedUser

  return updatedUser
}

export const remove = async (id: string): Promise<void> => {
  await delay()
  maybeFail('حذف کاربر انجام نشد.')

  const exists = usersStore.some(user => user.id === id)

  if (!exists) {
    throwApiError(createNotFoundError('کاربر یافت نشد.'))
  }

  usersStore = usersStore.filter(user => user.id !== id)
}
