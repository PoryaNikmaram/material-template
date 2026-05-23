import { Box, Button, Typography } from '@mui/material'

export const QueryErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Box className='flex flex-col items-center justify-center gap-3 py-12'>
    <i className='ri-error-warning-line text-5xl text-error' />
    <Typography color='error'>خطا در بارگذاری کاربران</Typography>
    <Button variant='outlined' color='error' onClick={onRetry}>
      تلاش مجدد
    </Button>
  </Box>
)
