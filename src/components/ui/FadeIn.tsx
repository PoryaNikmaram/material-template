'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'

type Props = {
  children: ReactNode
  delay?: number
  className?: string
  sx?: SxProps<Theme>
}

const FadeIn = ({ children, delay = 0, className, sx }: Props) => {
  return (
    <Box
      className={className}
      sx={{
        animation: 'fadeInUp 0.45s ease-out forwards',
        animationDelay: `${delay}ms`,
        opacity: 0,
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        ...sx
      }}
    >
      {children}
    </Box>
  )
}

export default FadeIn
