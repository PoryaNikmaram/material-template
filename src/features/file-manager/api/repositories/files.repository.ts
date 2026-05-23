import { createData, deleteData, readData } from '@/core/http-service/http-service'

import type { FileItem, UploadFilePayload } from '@/features/file-manager/types/files.types'

const FILES_ENDPOINT = '/files'

export const filesRepository = {
  getAll: (): Promise<FileItem[]> => readData<FileItem[]>(FILES_ENDPOINT),

  getById: (id: string): Promise<FileItem> => readData<FileItem>(`${FILES_ENDPOINT}/${id}`),

  upload: (payload: UploadFilePayload): Promise<FileItem> =>
    createData<UploadFilePayload, FileItem>(FILES_ENDPOINT, payload),

  remove: (id: string): Promise<void> => deleteData(`${FILES_ENDPOINT}/${id}`)
} as const
