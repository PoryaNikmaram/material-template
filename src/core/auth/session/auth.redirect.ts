export const redirectToLogin = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  const loginPath = '/login'

  if (window.location.pathname === loginPath) {
    return
  }

  window.location.assign(loginPath)
}
