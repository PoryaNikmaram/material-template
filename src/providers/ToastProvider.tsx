'use client'

// React Imports
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

// MUI Imports
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

// Lib Imports
import { toastStore } from '@/core/toast/toastStore'
import type { ToastItem, ToastOptions } from '@/core/toast/types'

export type ToastContextValue = {
  showToast: (options: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

type Props = {
  children: ReactNode
}

const ToastProvider = ({ children }: Props) => {
  const [queue, setQueue] = useState<ToastItem[]>([])
  const [active, setActive] = useState<ToastItem | null>(null)
  const [open, setOpen] = useState(false)

  const enqueueToast = useCallback((options: ToastOptions) => {
    const item = toastStore.createItem(options)

    setQueue(prev => [...prev, item])
  }, [])

  const showToast = useCallback((options: ToastOptions) => {
    enqueueToast(options)
  }, [enqueueToast])

  useEffect(() => {
    return toastStore.subscribe(enqueueToast)
  }, [enqueueToast])

  useEffect(() => {
    if (!active && queue.length > 0) {
      const [next, ...rest] = queue

      setActive(next)
      setQueue(rest)
      setOpen(true)
    }
  }, [active, queue])

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return

    setOpen(false)
  }

  const handleExited = () => {
    setActive(null)
  }

  const contextValue = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={active?.duration ?? 4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {active ? (
          <Alert
            onClose={handleClose}
            severity={active.severity}
            variant='filled'
            elevation={6}
            sx={{ width: '100%', minWidth: 280, maxWidth: 420 }}
          >
            {active.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  )
}

export default ToastProvider
