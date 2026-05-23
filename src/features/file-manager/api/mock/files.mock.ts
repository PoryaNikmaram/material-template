import { createNotFoundError, createServerError, throwApiError } from '@/core/http-service/errors'

import type { FileItem, UploadFilePayload } from '@/features/file-manager/types/files.types'

const initialFiles: FileItem[] = [
  {
    id: '1',
    name: 'گزارش-مالی-فصل-اول-۱۴۰۴.xlsx',
    size: 3145728,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedAt: '2026-05-20T11:20:00Z',
    folder: 'گزارش‌های مالی'
  },
  {
    id: '2',
    name: 'قرارداد-همکاری-مشتری-کلیدی.pdf',
    size: 2457600,
    mimeType: 'application/pdf',
    uploadedAt: '2026-05-19T09:45:00Z',
    folder: 'قراردادها'
  },
  {
    id: '3',
    name: 'لیست-مشتریان-فعال-Q2.xlsx',
    size: 891289,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedAt: '2026-05-18T14:30:00Z',
    folder: 'فروش و CRM'
  },
  {
    id: '4',
    name: 'مستندات-پروژه-سامانه-مدیریت.docx',
    size: 1572864,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedAt: '2026-05-17T16:10:00Z',
    folder: 'مستندات پروژه'
  },
  {
    id: '5',
    name: 'صورت‌جلسه-هیئت‌مدیره-اردیبهشت.pdf',
    size: 524288,
    mimeType: 'application/pdf',
    uploadedAt: '2026-05-16T08:00:00Z',
    folder: 'مدیریت'
  },
  {
    id: '6',
    name: 'چک‌لیست-استقرار-سیستم.pdf',
    size: 425984,
    mimeType: 'application/pdf',
    uploadedAt: '2026-05-15T13:25:00Z',
    folder: 'فناوری اطلاعات'
  }
]

let filesStore: FileItem[] = [...initialFiles]

const randomDelay = () => 500 + Math.floor(Math.random() * 701)

const delay = (ms?: number) => new Promise<void>(resolve => setTimeout(resolve, ms ?? randomDelay()))

const maybeFail = (message = 'عملیات با خطا مواجه شد. لطفاً دوباره تلاش کنید.') => {
  if (Math.random() < 0.2) {
    throwApiError(createServerError(message))
  }
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const getAll = async (): Promise<FileItem[]> => {
  await delay()

  return [...filesStore].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )
}

export const getById = async (id: string): Promise<FileItem> => {
  await delay()
  const file = filesStore.find(item => item.id === id)

  if (!file) {
    return throwApiError(createNotFoundError('فایل یافت نشد.'))
  }

  return file
}

export const upload = async (payload: UploadFilePayload): Promise<FileItem> => {
  await delay(800 + Math.floor(Math.random() * 400))
  maybeFail('آپلود فایل انجام نشد.')

  const newFile: FileItem = {
    id: generateId(),
    name: payload.name,
    size: payload.size,
    mimeType: payload.mimeType || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    folder: payload.folder || 'عمومی'
  }

  filesStore = [newFile, ...filesStore]

  return newFile
}

export const remove = async (id: string): Promise<void> => {
  await delay()
  maybeFail('حذف فایل انجام نشد.')

  const exists = filesStore.some(file => file.id === id)

  if (!exists) {
    throwApiError(createNotFoundError('فایل یافت نشد.'))
  }

  filesStore = filesStore.filter(file => file.id !== id)
}
