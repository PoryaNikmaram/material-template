type AuthDebugEvent =
  | 'login:success'
  | 'login:failure'
  | 'refresh:start'
  | 'refresh:success'
  | 'refresh:failure'
  | 'refresh:reuse'
  | 'logout:start'
  | 'logout:complete'
  | 'tokens:missing'
  | 'bootstrap:start'
  | 'bootstrap:complete'
  | 'bootstrap:skip'
  | 'recovery:triggered'
  | 'axios:request'
  | 'axios:401-refresh'
  | 'axios:retry'
  | 'axios:403-skip-refresh'

type AuthDebugPayload = Record<string, unknown>

type AuthDebugLogger = {
  log: (event: AuthDebugEvent, payload?: AuthDebugPayload) => void
  loginSuccess: (payload?: AuthDebugPayload) => void
  loginFailure: (payload?: AuthDebugPayload) => void
  refreshStart: (payload?: AuthDebugPayload) => void
  refreshSuccess: (payload?: AuthDebugPayload) => void
  refreshFailure: (payload?: AuthDebugPayload) => void
  refreshReuse: (payload?: AuthDebugPayload) => void
  logoutStart: (payload?: AuthDebugPayload) => void
  logoutComplete: (payload?: AuthDebugPayload) => void
  missingTokens: (payload?: AuthDebugPayload) => void
  bootstrapStart: (payload?: AuthDebugPayload) => void
  bootstrapComplete: (payload?: AuthDebugPayload) => void
  bootstrapSkip: (payload?: AuthDebugPayload) => void
  recoveryTriggered: (payload?: AuthDebugPayload) => void
  axiosRequest: (payload?: AuthDebugPayload) => void
  axios401Refresh: (payload?: AuthDebugPayload) => void
  axiosRetry: (payload?: AuthDebugPayload) => void
  axios403SkipRefresh: (payload?: AuthDebugPayload) => void
}

const createDevLogger = (): AuthDebugLogger => {
  const log = (event: AuthDebugEvent, payload?: AuthDebugPayload): void => {
    if (payload) {
      console.debug(`[auth] ${event}`, payload)
    } else {
      console.debug(`[auth] ${event}`)
    }
  }

  return {
    log,
    loginSuccess: payload => log('login:success', payload),
    loginFailure: payload => log('login:failure', payload),
    refreshStart: payload => log('refresh:start', payload),
    refreshSuccess: payload => log('refresh:success', payload),
    refreshFailure: payload => log('refresh:failure', payload),
    refreshReuse: payload => log('refresh:reuse', payload),
    logoutStart: payload => log('logout:start', payload),
    logoutComplete: payload => log('logout:complete', payload),
    missingTokens: payload => log('tokens:missing', payload),
    bootstrapStart: payload => log('bootstrap:start', payload),
    bootstrapComplete: payload => log('bootstrap:complete', payload),
    bootstrapSkip: payload => log('bootstrap:skip', payload),
    recoveryTriggered: payload => log('recovery:triggered', payload),
    axiosRequest: payload => log('axios:request', payload),
    axios401Refresh: payload => log('axios:401-refresh', payload),
    axiosRetry: payload => log('axios:retry', payload),
    axios403SkipRefresh: payload => log('axios:403-skip-refresh', payload)
  }
}

const createNoopLogger = (): AuthDebugLogger => ({
  log: () => undefined,
  loginSuccess: () => undefined,
  loginFailure: () => undefined,
  refreshStart: () => undefined,
  refreshSuccess: () => undefined,
  refreshFailure: () => undefined,
  refreshReuse: () => undefined,
  logoutStart: () => undefined,
  logoutComplete: () => undefined,
  missingTokens: () => undefined,
  bootstrapStart: () => undefined,
  bootstrapComplete: () => undefined,
  bootstrapSkip: () => undefined,
  recoveryTriggered: () => undefined,
  axiosRequest: () => undefined,
  axios401Refresh: () => undefined,
  axiosRetry: () => undefined,
  axios403SkipRefresh: () => undefined
})

export const authDebug: AuthDebugLogger =
  process.env.NODE_ENV === 'development' ? createDevLogger() : createNoopLogger()
