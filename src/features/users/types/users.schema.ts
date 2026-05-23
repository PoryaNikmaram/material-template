import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email: z.string().trim().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست'),
  role: z.string().trim().min(1, 'نقش الزامی است')
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
