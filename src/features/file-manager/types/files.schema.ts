import { z } from 'zod'

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

export const uploadFileSchema = z.object({
  name: z.string().trim().min(1, 'نام فایل الزامی است'),
  size: z
    .number()
    .positive('فایل نامعتبر است')
    .max(MAX_FILE_SIZE_BYTES, 'حداکثر حجم فایل ۵۰ مگابایت است'),
  mimeType: z.string().optional(),
  folder: z.string().optional()
})

export type UploadFileFormValues = z.infer<typeof uploadFileSchema>
