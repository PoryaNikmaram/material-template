import { authRepository } from '@/features/auth/api/repositories/auth.repository'

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

export type {
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

export const login = (payload: LoginPayload): Promise<LoginResponse> => authRepository.login(payload)

export const register = (payload: RegisterPayload): Promise<RegisterResponse> => authRepository.register(payload)

export const forgotPassword = (payload: ForgotPasswordPayload): Promise<string> =>
  authRepository.forgotPassword(payload)

export const logout = (payload: LogoutPayload): Promise<string> => authRepository.logout(payload)

export const refresh = (payload: RefreshPayload): Promise<RefreshResponse> => authRepository.refresh(payload)

export const getCurrentUser = (): Promise<AuthUser> => authRepository.me()

export const getMe = getCurrentUser

export const resetPassword = (payload: ResetPasswordPayload): Promise<string> =>
  authRepository.resetPassword(payload)

export const verifyEmail = (payload: VerifyEmailPayload): Promise<string> => authRepository.verifyEmail(payload)

export { authRepository }
