import { createData, readData } from '@/core/http-service/http-service'

import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  LogoutPayload,
  RefreshPayload,
  RefreshResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  VerifyEmailPayload
} from '@/features/auth/types/auth.types'

const AUTH_ENDPOINT = '/v1/auth'

export const authRepository = {
  login: (payload: LoginPayload): Promise<LoginResponse> =>
    createData<LoginPayload, LoginResponse>(`${AUTH_ENDPOINT}/login`, payload),

  register: (payload: RegisterPayload): Promise<RegisterResponse> =>
    createData<RegisterPayload, RegisterResponse>(`${AUTH_ENDPOINT}/register`, payload),

  forgotPassword: (payload: ForgotPasswordPayload): Promise<string> =>
    createData<ForgotPasswordPayload, string>(`${AUTH_ENDPOINT}/forgot-password`, payload),

  logout: (payload: LogoutPayload): Promise<string> =>
    createData<LogoutPayload, string>(`${AUTH_ENDPOINT}/logout`, payload, { _skipAuthRefresh: true }),

  refresh: (payload: RefreshPayload): Promise<RefreshResponse> =>
    createData<RefreshPayload, RefreshResponse>(`${AUTH_ENDPOINT}/refresh`, payload),

  me: (): Promise<AuthUser> => readData<AuthUser>(`${AUTH_ENDPOINT}/me`),

  resetPassword: (payload: ResetPasswordPayload): Promise<string> =>
    createData<ResetPasswordPayload, string>(`${AUTH_ENDPOINT}/reset-password`, payload),

  verifyEmail: (payload: VerifyEmailPayload): Promise<string> =>
    createData<VerifyEmailPayload, string>(`${AUTH_ENDPOINT}/verify-email`, payload)
} as const
