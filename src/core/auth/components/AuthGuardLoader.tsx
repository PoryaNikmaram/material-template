'use client'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const AuthGuardLoader = () => {
  return (
    <Box className='flex items-center justify-center min-bs-[100dvh] w-full'>
      <CircularProgress color='primary' size={40} />
    </Box>
  )
}

export default AuthGuardLoader
