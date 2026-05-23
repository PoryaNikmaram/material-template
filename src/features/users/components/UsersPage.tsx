'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import FadeIn from '@components/ui/FadeIn'
import { useToast } from '@/providers/useToast'
import UserCreateDialog from '@/features/users/components/UserCreateDialog'

// API Imports
import { createUser, deleteUser, getUsers } from '@/features/users/api'
import type { User, UserStatus } from '@/features/users/types/users.types'
import { usersQueryKeys } from '@/features/users/api/queryKeys'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const SKELETON_ROWS = 5

const tableRowHoverSx = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgb(var(--mui-mainColorChannels-light) / 0.08)',
    bgcolor: 'action.hover'
  }
}

const statusMap: Record<UserStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  active: { label: 'فعال', color: 'success' },
  pending: { label: 'در انتظار', color: 'warning' },
  inactive: { label: 'غیرفعال', color: 'default' }
}

const UsersTableSkeleton = () => (
  <TableContainer>
    <Table className={tableStyles.table}>
      <TableHead>
        <TableRow>
          {['کاربر', 'ایمیل', 'نقش', 'وضعیت', 'عملیات'].map(header => (
            <TableCell key={header}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell>
              <Box className='flex items-center gap-3'>
                <Skeleton variant='circular' width={34} height={34} animation='wave' />
                <Skeleton width={120} animation='wave' />
              </Box>
            </TableCell>
            <TableCell>
              <Skeleton width={160} />
            </TableCell>
            <TableCell>
              <Skeleton width={80} />
            </TableCell>
            <TableCell>
              <Skeleton width={64} height={24} />
            </TableCell>
            <TableCell>
              <Skeleton variant='circular' width={32} height={32} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

const QueryErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Box className='flex flex-col items-center justify-center gap-3 py-12'>
    <i className='ri-error-warning-line text-5xl text-error' />
    <Typography color='error'>خطا در بارگذاری کاربران</Typography>
    <Button variant='outlined' color='error' onClick={onRetry}>
      تلاش مجدد
    </Button>
  </Box>
)

const Users = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [openCreate, setOpenCreate] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: users = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: usersQueryKeys.all,
    queryFn: getUsers
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: async (userId: string) => {
      setDeletingId(userId)
      await queryClient.cancelQueries({ queryKey: usersQueryKeys.all })

      const previousUsers = queryClient.getQueryData<User[]>(usersQueryKeys.all)

      queryClient.setQueryData<User[]>(usersQueryKeys.all, old =>
        old ? old.filter(user => user.id !== userId) : []
      )

      return { previousUsers }
    },
    onSuccess: () => {
      showToast({ message: 'کاربر با موفقیت حذف شد', severity: 'success' })
    },
    onError: (_error, _userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(usersQueryKeys.all, context.previousUsers)
      }
    },
    onSettled: () => {
      setDeletingId(null)
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
    }
  })

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showToast({ message: 'ایجاد کاربر انجام شد', severity: 'success' })
      setOpenCreate(false)
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
    }
  })

  const renderContent = () => {
    if (isLoading) return <UsersTableSkeleton />

    if (isError) {
      return <QueryErrorState onRetry={() => refetch()} />
    }

    if (users.length === 0) {
      return (
        <Box className='flex flex-col items-center justify-center gap-2 py-12'>
          <i className='ri-group-line text-6xl text-textDisabled opacity-80' />
          <Typography variant='h6'>کاربری یافت نشد</Typography>
          <Typography color='text.secondary'>برای شروع، کاربر جدید اضافه کنید.</Typography>
          <Button
            variant='contained'
            className='mbs-2'
            startIcon={<i className='ri-user-add-line' />}
            onClick={() => setOpenCreate(true)}
          >
            افزودن کاربر
          </Button>
        </Box>
      )
    }

    return (
      <TableContainer>
        <Table className={tableStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell>کاربر</TableCell>
              <TableCell>ایمیل</TableCell>
              <TableCell>نقش</TableCell>
              <TableCell>وضعیت</TableCell>
              <TableCell align='center'>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id} hover sx={tableRowHoverSx}>
                <TableCell>
                  <Box className='flex items-center gap-3'>
                    <CustomAvatar src={user.avatarSrc} size={34}>
                      {user.name.charAt(0)}
                    </CustomAvatar>
                    <Typography color='text.primary' className='font-medium'>
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={statusMap[user.status].label}
                    color={statusMap[user.status].color}
                    size='small'
                    variant='tonal'
                  />
                </TableCell>
                <TableCell align='center'>
                  <Tooltip title='حذف کاربر'>
                    <span>
                      <IconButton
                        size='small'
                        color='error'
                        disabled={deletingId === user.id}
                        onClick={() => deleteMutation.mutate(user.id)}
                      >
                        <i className={deletingId === user.id ? 'ri-loader-4-line animate-spin' : 'ri-delete-bin-7-line'} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <>
      <FadeIn>
      <Card>
        <CardContent sx={{ transition: 'opacity 0.35s ease', opacity: isLoading ? 0.7 : 1 }}>
          <Box className='flex flex-wrap items-center justify-between gap-4 mbe-4'>
            <div>
              <Typography variant='h4' className='mbe-1'>
                مدیریت کاربران
              </Typography>
              <Typography color='text.secondary'>فهرست کاربران سازمان با بارگذاری ناهمزمان</Typography>
            </div>
            <Button
              variant='contained'
              startIcon={<i className='ri-user-add-line' />}
              onClick={() => setOpenCreate(true)}
              disabled={isLoading || isFetching}
            >
              افزودن کاربر
            </Button>
          </Box>

          {renderContent()}
        </CardContent>
      </Card>
      </FadeIn>

      <UserCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        createMutation={createMutation}
      />
    </>
  )
}

export default Users
