import { isMockApiEnabled } from '@/core/api/config'
import * as filesMock from '@/features/file-manager/api/mock/files.mock'
import { filesRepository } from '@/features/file-manager/api/repositories/files.repository'
import type { FileItem, UploadFilePayload } from '@/features/file-manager/types/files.types'

export type { FileItem, UploadFilePayload } from '@/features/file-manager/types/files.types'

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const repository = isMockApiEnabled() ? filesMock : filesRepository

export const getFiles = (): Promise<FileItem[]> => repository.getAll()

export const getFileById = (id: string): Promise<FileItem> => repository.getById(id)

export const uploadFile = (payload: UploadFilePayload): Promise<FileItem> => repository.upload(payload)

export const deleteFile = (id: string): Promise<void> => repository.remove(id)

export { filesRepository }
