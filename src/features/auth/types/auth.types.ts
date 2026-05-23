export type AuthUser = {
  id: string
  email: string
  username: string
  name: string
  role: string
}

export type LoginPayload = {
  nationalId: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user?: AuthUser
}

export type RegisterPayload = {
  username: string
  email: string
  password: string
}

export type RegisterResponse = {
  id: string
  email: string
  username: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type LogoutPayload = {
  refreshToken: string
}

export type RefreshPayload = {
  refreshToken: string
}

export type RefreshResponse = LoginResponse

export type ResetPasswordPayload = {
  token: string
  password: string
}

export type VerifyEmailPayload = {
  token: string
}
