export type FileItem = {
  id: string
  name: string
  size: number
  mimeType: string
  uploadedAt: string
  folder: string
}

export type UploadFilePayload = {
  name: string
  size: number
  mimeType?: string
  folder?: string
}
