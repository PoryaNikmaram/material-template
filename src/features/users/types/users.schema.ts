import { z } from 'zod'

export const USER_ROLES = ['admin', 'user'] as const

export const USER_ROLE_LABELS: Record<(typeof USER_ROLES)[number], string> = {
  admin: 'مدیر',
  user: 'کاربر'
}
export const USER_JOBS = ['داروساز', 'حسابدار', 'مدیر فروش', 'تاجر', 'برنامه نویس'] as const

const userFields = {
  nationalId: z.string(),
  firstName: z.string().trim().min(1, 'نام الزامی است'),
  lastName: z.string().trim().min(1, 'نام خانوادگی الزامی است'),
  job: z.enum(USER_JOBS, { required_error: 'شغل الزامی است' }),
  address: z.string(),
  phoneNumber: z.string(),
  fatherName: z.string(),
  officeNumber: z.string(),
  bankAccountNumber: z.string(),
  registrationNumber: z.string(),
  description: z.string(),
  email: z.string().trim().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست'),
  username: z.string().trim().min(1, 'نام کاربری الزامی است'),
  role: z.enum(USER_ROLES, { required_error: 'نقش الزامی است' }),
  isActive: z.boolean()
}

export const createUserSchema = z
  .object({
    ...userFields,
    password: z.string().trim().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: z.string().trim().min(1, 'تکرار رمز عبور الزامی است')
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', message: 'رمز عبور و تکرار آن یکسان نیستند', path: ['confirmPassword'] })
    }
  })

export const editUserSchema = z.object(userFields)

export const createEmptyValues: CreateUserFormValues = {
  nationalId: '',
  firstName: '',
  lastName: '',
  job: USER_JOBS[0],
  password: '',
  confirmPassword: '',
  address: '',
  phoneNumber: '',
  fatherName: '',
  officeNumber: '',
  bankAccountNumber: '',
  registrationNumber: '',
  description: '',
  email: '',
  username: '',
  role: USER_ROLES[1],
  isActive: true
}

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type EditUserFormValues = z.infer<typeof editUserSchema>
