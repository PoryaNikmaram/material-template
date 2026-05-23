'use client'

import { useMemo, useReducer, useRef, useState, type ChangeEvent } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { usersQueryKeys } from '@/features/users'
import { deleteUser, importUsers } from '@/features/users/api'
import UserDialog from '@/features/users/components/UserDialog'
import { useUsersListQuery } from '@/features/users/hooks/useUsersQuery'
import type { User, UserImportResult, UsersListParams } from '@/features/users/types/users.types'
import { USER_IMPORT_ALLOWED_EXTENSIONS } from '@/features/users/types/users.types'
import { USER_ROLE_LABELS, USER_ROLES } from '@/features/users/types/users.schema'
import { useToast } from '@/providers/useToast'
import FadeIn from '@components/ui/FadeIn'
import CustomAvatar from '@core/components/mui/Avatar'

import tableStyles from '@core/styles/table.module.css'
import { QueryErrorState } from './QueryErrorState'
import { UsersTableSkeleton } from './UsersTableSkeleton'

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]
const EXCEL_ACCEPT = USER_IMPORT_ALLOWED_EXTENSIONS.join(',')

const isAllowedExcelFile = (file: File) => {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()

  return USER_IMPORT_ALLOWED_EXTENSIONS.includes(extension as (typeof USER_IMPORT_ALLOWED_EXTENSIONS)[number])
}

type UsersPageState = {
  dialogUserId?: string
  dialogOpen: boolean
  search: string
  page: number
  pageSize: number
}

type UsersPageAction =
  | { type: 'OPEN_CREATE_DIALOG' }
  | { type: 'OPEN_EDIT_DIALOG'; userId: string }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_PAGE_SIZE'; pageSize: number }

const initialState: UsersPageState = {
  dialogOpen: false,
  search: '',
  page: 0,
  pageSize: 10
}

const usersPageReducer = (state: UsersPageState, action: UsersPageAction): UsersPageState => {
  switch (action.type) {
    case 'OPEN_CREATE_DIALOG':
      return { ...state, dialogOpen: true, dialogUserId: undefined }
    case 'OPEN_EDIT_DIALOG':
      return { ...state, dialogOpen: true, dialogUserId: action.userId }
    case 'CLOSE_DIALOG':
      return { ...state, dialogOpen: false, dialogUserId: undefined }
    case 'SET_SEARCH':
      return { ...state, search: action.search, page: 0 }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.pageSize, page: 0 }
    default:
      return state
  }
}

const tableRowHoverSx = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgb(var(--mui-mainColorChannels-light) / 0.08)',
    bgcolor: 'action.hover'
  }
}

const UsersPage = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importResult, setImportResult] = useState<UserImportResult | null>(null)
  const [state, dispatch] = useReducer(usersPageReducer, initialState)

  const listParams = useMemo<UsersListParams>(
    () => ({
      page: state.page + 1,
      pageSize: state.pageSize,
      search: state.search.trim() || undefined
    }),
    [state.page, state.pageSize, state.search]
  )

  const { data, isLoading, isError, refetch, isFetching } = useUsersListQuery(listParams)

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      showToast({ message: 'کاربر با موفقیت حذف شد', severity: 'success' })
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
    }
  })

  const importMutation = useMutation({
    mutationFn: importUsers,
    onSuccess: result => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
      showToast({
        message: `${result.createdCount} کاربر ایجاد شد، ${result.skippedCount} مورد رد شد`,
        severity: result.errors?.length ? 'warning' : 'success'
      })

      if (result.errors?.length) {
        setImportResult(result)
      }
    },
    onError: () => {
      showToast({ message: 'خطا در بارگذاری فایل اکسل', severity: 'error' })
    }
  })

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    event.target.value = ''

    if (!file) return

    if (!isAllowedExcelFile(file)) {
      showToast({ message: 'فقط فایل‌های .xlsx و .xls مجاز هستند', severity: 'error' })

      return
    }

    importMutation.mutate(file)
  }

  const handlePageChange = (_event: unknown, newPage: number) => {
    dispatch({ type: 'SET_PAGE', page: newPage })
  }

  const handlePageSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_PAGE_SIZE', pageSize: Number(event.target.value) })
  }

  const renderContent = () => {
    if (isLoading) {
      return <UsersTableSkeleton tableStyles={tableStyles.table} />
    }

    if (isError) {
      return <QueryErrorState onRetry={() => refetch()} />
    }

    if (data?.items?.length === 0) {
      return (
        <Box className='flex flex-col items-center justify-center gap-2 py-12'>
          <Typography variant='h6'>کاربری یافت نشد</Typography>
        </Box>
      )
    }

    return (
      <>
        <TableContainer>
          <Table className={tableStyles.table}>
            <TableHead>
              <TableRow>
                <TableCell>کاربر</TableCell>
                <TableCell>نام کاربری</TableCell>
                <TableCell>ایمیل</TableCell>
                <TableCell>نقش</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell align='center'>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items?.map((user: User) => {
                const displayName =
                  [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.email || '—'

                const initial = (user.firstName || user.username || user.email || '?').charAt(0).toUpperCase()

                return (
                  <TableRow key={user.id} hover sx={tableRowHoverSx}>
                    <TableCell>
                      <Box className='flex items-center gap-3'>
                        <CustomAvatar size={34}>{initial}</CustomAvatar>
                        <Typography color='text.primary' className='font-medium'>
                          {displayName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.username ?? '—'}</TableCell>
                    <TableCell>{user.email ?? '—'}</TableCell>
                    <TableCell>
                      {user.role && USER_ROLES.includes(user.role as (typeof USER_ROLES)[number])
                        ? USER_ROLE_LABELS[user.role as (typeof USER_ROLES)[number]]
                        : (user.role ?? '—')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'فعال' : 'غیرفعال'}
                        color={user.isActive ? 'success' : 'default'}
                        size='small'
                        variant='tonal'
                      />
                    </TableCell>
                    <TableCell align='center'>
                      <Box className='flex items-center justify-center gap-1'>
                        <Tooltip title='ویرایش کاربر'>
                          <IconButton
                            size='small'
                            color='primary'
                            onClick={() => dispatch({ type: 'OPEN_EDIT_DIALOG', userId: user.id })}
                          >
                            <i className='ri-edit-line' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='حذف کاربر'>
                          <span>
                            <IconButton
                              size='small'
                              color='error'
                              disabled={deleteMutation.isPending && deleteMutation.variables === user.id}
                              onClick={() => deleteMutation.mutate(user.id)}
                            >
                              <i
                                className={
                                  deleteMutation.isPending && deleteMutation.variables === user.id
                                    ? 'ri-loader-4-line animate-spin'
                                    : 'ri-delete-bin-7-line'
                                }
                              />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          count={data?.totalCount ?? 0}
          page={state.page}
          onPageChange={handlePageChange}
          rowsPerPage={state.pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          labelRowsPerPage='تعداد در صفحه:'
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count !== -1 ? count : `بیش از ${to}`}`}
        />
      </>
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
                <Typography color='text.secondary'>فهرست کاربران سازمان با صفحه‌بندی و جستجو</Typography>
              </div>
              <Box className='flex flex-wrap items-center gap-2'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={EXCEL_ACCEPT}
                  hidden
                  onChange={handleImportFileChange}
                />
                <Button
                  variant='outlined'
                  startIcon={<i className='ri-file-excel-2-line' />}
                  onClick={handleImportClick}
                  disabled={isLoading || isFetching || importMutation.isPending}
                >
                  {importMutation.isPending ? 'در حال بارگذاری...' : 'اضافه کردن از طریق اکسل'}
                </Button>
                <Button
                  variant='contained'
                  startIcon={<i className='ri-user-add-line' />}
                  onClick={() => dispatch({ type: 'OPEN_CREATE_DIALOG' })}
                  disabled={isLoading || isFetching}
                >
                  افزودن کاربر
                </Button>
              </Box>
            </Box>

            <Box className='mbe-4'>
              <TextField
                fullWidth
                size='small'
                placeholder='جستجو بر اساس نام، ایمیل یا نام کاربری...'
                value={state.search}
                onChange={event => dispatch({ type: 'SET_SEARCH', search: event.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-search-line' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {renderContent()}
          </CardContent>
        </Card>
      </FadeIn>

      <UserDialog
        key={state.dialogUserId ?? 'create'}
        open={state.dialogOpen}
        userId={state.dialogUserId}
        onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}
      />

      <Dialog open={Boolean(importResult)} onClose={() => setImportResult(null)} fullWidth maxWidth='sm'>
        <DialogTitle>خطاهای import</DialogTitle>
        <DialogContent className='pbs-4'>
          {importResult?.errors?.map((error, index) => (
            <Typography key={`${error.row}-${index}`} className='mbe-2'>
              سطر {error.row}: {error.nationalId ?? '—'} — {error.message ?? 'خطای نامشخص'}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportResult(null)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UsersPage
