import type { ToastItem, ToastOptions } from './types'

type ToastListener = (options: ToastOptions) => void

let listener: ToastListener | null = null

const severityDuration = {
  success: 3500,
  error: 5000,
  warning: 4500,
  info: 4000
} as const

export const toastStore = {
  subscribe: (nextListener: ToastListener): (() => void) => {
    listener = nextListener

    return () => {
      if (listener === nextListener) {
        listener = null
      }
    }
  },

  show: (options: ToastOptions): void => {
    listener?.({
      ...options,
      duration: options.duration ?? severityDuration[options.severity ?? 'info']
    })
  },

  createItem: (options: ToastOptions): ToastItem => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    message: options.message,
    severity: options.severity ?? 'info',
    duration: options.duration ?? severityDuration[options.severity ?? 'info']
  })
}
