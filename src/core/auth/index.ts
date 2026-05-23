export { default as AuthBootstrap } from './components/AuthBootstrap'
export { default as AuthGuardLoader } from './components/AuthGuardLoader'
export { default as RequireAuth } from './components/RequireAuth'
export { authDebug } from './debug/auth.debug'
export { hasRole, hasRoleFromCache } from './guards/hasRole'
export { useAuthRecovery } from './hooks/useAuthRecovery'
export { useCurrentUserQuery } from './hooks/useCurrentUserQuery'
export { useRequireAuth } from './hooks/useRequireAuth'
export { ensureAuthBootstrap, resetAuthBootstrap } from './session/auth.bootstrap'
export { completeLoginSession } from './session/auth.login'
export { logoutSession } from './session/auth.logout'
export { redirectToLogin } from './session/auth.redirect'
export { refreshAuthTokens } from './session/auth.refresh'
export { getAuthSnapshot } from './state/auth.snapshot'
export type { AuthSnapshot } from './state/auth.snapshot'
export {
  clearAuthStorage,
  getAccessToken,
  getExpiresIn,
  getRefreshToken,
  persistAuthTokens,
  removeAccessToken,
  removeExpiresIn,
  removeRefreshToken,
  setAccessToken,
  setExpiresIn,
  setRefreshToken
} from './storage/auth.storage'
