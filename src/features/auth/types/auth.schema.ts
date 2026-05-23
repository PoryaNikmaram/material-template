import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
  rememberMe: z.boolean().optional()
})

export const registerSchema = z.object({
  username: z.string().trim().min(2, 'نام کاربری باید حداقل ۲ کاراکتر باشد'),
  email: z.string().trim().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
  acceptTerms: z.boolean().refine(value => value === true, {
    message: 'پذیرش قوانین و شرایط الزامی است'
  })
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست')
})

export type SignInFormValues = z.infer<typeof signInSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
