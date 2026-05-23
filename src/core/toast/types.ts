export type ToastSeverity = 'success' | 'error' | 'warning' | 'info'

export type ToastOptions = {
  message: string
  severity?: ToastSeverity
  duration?: number
}

export type ToastItem = ToastOptions & {
  id: string
}
