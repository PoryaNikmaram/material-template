'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useQuery } from '@tanstack/react-query'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import FadeIn from '@components/ui/FadeIn'
import KpiCard from '@components/shared/KpiCard'

// API Imports
import { formatFileSize, getFiles, filesQueryKeys } from '@/features/file-manager'
import type { FileItem } from '@/features/file-manager'
import { getUsers, usersQueryKeys } from '@/features/users'
import type { User } from '@/features/users'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const dashboardUsersParams = { page: 1, pageSize: 5 } as const

const activityFeedSeed = [
  {
    id: '1',
    user: 'مریم احمدی',
    action: 'فایل «گزارش مالی فصل اول» را آپلود کرد',
    time: '۲ دقیقه پیش',
    icon: 'ri-upload-cloud-line',
    color: 'info' as const
  },
  {
    id: '2',
    user: 'علی رضایی',
    action: 'کاربر جدید «امیر حسینی» را تأیید کرد',
    time: '۸ دقیقه پیش',
    icon: 'ri-user-follow-line',
    color: 'success' as const
  },
  {
    id: '3',
    user: 'نرگس صادقی',
    action: 'گزارش تحلیل مشتریان را مشاهده کرد',
    time: '۱۵ دقیقه پیش',
    icon: 'ri-eye-line',
    color: 'primary' as const
  },
  {
    id: '4',
    user: 'رضا نوری',
    action: 'تیکت پشتیبانی #۴۲۱۰ را بست',
    time: '۲۳ دقیقه پیش',
    icon: 'ri-customer-service-2-line',
    color: 'warning' as const
  },
  {
    id: '5',
    user: 'سارا موسوی',
    action: 'قرارداد همکاری را به‌روزرسانی کرد',
    time: '۳۵ دقیقه پیش',
    icon: 'ri-file-edit-line',
    color: 'secondary' as const
  }
]

const tableRowHoverSx = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgb(var(--mui-mainColorChannels-light) / 0.08)',
    bgcolor: 'action.hover'
  }
}

const PreviewSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Box className='flex flex-col gap-2'>
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} variant='rounded' height={48} animation='wave' />
    ))}
  </Box>
)

const Dashboard = () => {
  const [liveIndex, setLiveIndex] = useState(0)

  const { data: usersResult, isLoading: usersLoading } = useQuery({
    queryKey: usersQueryKeys.list(dashboardUsersParams),
    queryFn: () => getUsers(dashboardUsersParams)
  })

  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: filesQueryKeys.all,
    queryFn: getFiles
  })

  const users = usersResult?.items ?? []
  const activeUsers = users.filter((user: User) => user.isActive).length
  const topUsers = users
  const totalUsers = usersResult?.totalCount ?? users.length
  const latestFiles = files.slice(0, 5)

  const kpis = useMemo(
    () => [
      {
        title: 'کاربران فعال',
        value: usersLoading ? '—' : String(activeUsers),
        subtitle: `از ${totalUsers} کاربر ثبت‌شده`,
        trend: 12,
        trendLabel: 'نسبت به هفته قبل',
        icon: 'ri-group-line',
        color: 'primary' as const
      },
      {
        title: 'فایل‌های آپلود شده',
        value: filesLoading ? '—' : String(files.length),
        subtitle: 'در فضای سازمانی',
        trend: 8,
        trendLabel: 'رشد ماه جاری',
        icon: 'ri-folder-upload-line',
        color: 'info' as const
      },
      {
        title: 'نرخ فعالیت روزانه',
        value: '۷۸٪',
        subtitle: 'میانگین ۲۴ ساعت گذشته',
        trend: 5,
        trendLabel: 'بهبود عملکرد تیم',
        icon: 'ri-pulse-line',
        color: 'success' as const
      },
      {
        title: 'وضعیت سیستم',
        value: '۹۹٫۹٪',
        subtitle: 'آپ‌تایم سرویس‌ها',
        trend: 0.2,
        trendLabel: 'پایدار — بدون قطعی',
        icon: 'ri-server-line',
        color: 'secondary' as const
      }
    ],
    [activeUsers, totalUsers, files.length, usersLoading, filesLoading]
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveIndex(prev => (prev + 1) % activityFeedSeed.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso))

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FadeIn>
          <Card
            sx={{
              background: theme =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'primary.contrastText'
            }}
          >
            <CardContent className='flex flex-wrap items-center justify-between gap-4'>
              <Box>
                <Typography variant='h4' className='mbe-2 font-medium'>
                  پلتفرم مدیریت کاربران و فایل‌های سازمانی
                </Typography>
                <Typography sx={{ opacity: 0.9, maxWidth: 560 }}>
                  نمای اجرایی سامانه — وضعیت کاربران، فایل‌ها و فعالیت‌های اخیر سازمان را یک‌جا مشاهده کنید.
                </Typography>
              </Box>
              <Box className='flex gap-2 flex-wrap'>
                <Button component={Link} href='/users' variant='contained' color='secondary'>
                  مدیریت کاربران
                </Button>
                <Button
                  component={Link}
                  href='/file-manager'
                  variant='outlined'
                  sx={{ borderColor: 'primary.contrastText', color: 'primary.contrastText' }}
                >
                  مدیریت فایل‌ها
                </Button>
              </Box>
            </CardContent>
          </Card>
        </FadeIn>
      </Grid>

      {kpis.map((kpi, index) => (
        <Grid item xs={12} sm={6} lg={3} key={kpi.title}>
          {usersLoading && index < 2 ? (
            <Skeleton variant='rounded' height={160} animation='wave' />
          ) : (
            <KpiCard {...kpi} delay={index * 80} />
          )}
        </Grid>
      ))}

      <Grid item xs={12} lg={8}>
        <FadeIn delay={320}>
          <Card className='bs-full'>
            <CardContent>
              <Box className='flex flex-wrap items-center justify-between gap-2 mbe-4'>
                <Typography variant='h6'>پیش‌نمایش کاربران</Typography>
                <Button component={Link} href='/users' size='small' endIcon={<i className='ri-arrow-left-line' />}>
                  مشاهده همه
                </Button>
              </Box>
              {usersLoading ? (
                <PreviewSkeleton />
              ) : (
                <TableContainer sx={{ opacity: usersLoading ? 0 : 1, transition: 'opacity 0.35s ease' }}>
                  <Table className={tableStyles.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>کاربر</TableCell>
                        <TableCell>نقش</TableCell>
                        <TableCell>وضعیت</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topUsers.map((user: User) => {
                        const displayName =
                          [user.firstName, user.lastName].filter(Boolean).join(' ') ||
                          user.username ||
                          user.email ||
                          '—'

                        const initial = (user.firstName || user.username || user.email || '?').charAt(0).toUpperCase()

                        return (
                          <TableRow key={user.id} hover sx={tableRowHoverSx}>
                            <TableCell>
                              <Box className='flex items-center gap-2'>
                                <CustomAvatar size={32}>{initial}</CustomAvatar>
                                <Box>
                                  <Typography variant='body2' className='font-medium'>
                                    {displayName}
                                  </Typography>
                                  <Typography variant='caption' color='text.secondary'>
                                    {user.email ?? '—'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{user.role ?? '—'}</TableCell>
                            <TableCell>
                              <Chip
                                size='small'
                                variant='tonal'
                                label={user.isActive ? 'فعال' : 'غیرفعال'}
                                color={user.isActive ? 'success' : 'default'}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </Grid>

      <Grid item xs={12} lg={4}>
        <FadeIn delay={400}>
          <Card className='bs-full'>
            <CardContent>
              <Box className='flex items-center gap-2 mbe-4'>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.5, transform: 'scale(1.15)' }
                    }
                  }}
                />
                <Typography variant='h6'>فعالیت لحظه‌ای سیستم</Typography>
              </Box>
              <Box className='flex flex-col gap-3'>
                {activityFeedSeed.map((item, index) => (
                  <Box
                    key={item.id}
                    className='flex gap-3 p-3 rounded'
                    sx={{
                      bgcolor: index === liveIndex ? 'action.selected' : 'transparent',
                      borderInlineStart: '3px solid',
                      borderColor: index === liveIndex ? `${item.color}.main` : 'divider',
                      transition: 'background-color 0.4s ease, border-color 0.4s ease',
                      opacity: index === liveIndex ? 1 : 0.85
                    }}
                  >
                    <CustomAvatar color={item.color} skin='light' size={36}>
                      <i className={item.icon} />
                    </CustomAvatar>
                    <Box className='flex-1 min-is-0'>
                      <Typography variant='body2' className='font-medium'>
                        {item.user}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {item.action}
                      </Typography>
                      <Typography variant='caption' color='text.disabled' display='block' className='mts-1'>
                        {item.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </FadeIn>
      </Grid>

      <Grid item xs={12}>
        <FadeIn delay={480}>
          <Card>
            <CardContent>
              <Box className='flex flex-wrap items-center justify-between gap-2 mbe-4'>
                <Typography variant='h6'>آخرین فعالیت فایل‌ها</Typography>
                <Button
                  component={Link}
                  href='/file-manager'
                  size='small'
                  endIcon={<i className='ri-arrow-left-line' />}
                >
                  مشاهده همه
                </Button>
              </Box>
              {filesLoading ? (
                <PreviewSkeleton rows={5} />
              ) : (
                <Grid container spacing={3} sx={{ opacity: filesLoading ? 0 : 1, transition: 'opacity 0.35s ease' }}>
                  {latestFiles.map((file: FileItem) => (
                    <Grid item xs={12} md={6} lg={4} key={file.id}>
                      <Box
                        className='flex items-center gap-3 p-4 rounded border border-[var(--border-color)]'
                        sx={{
                          ...tableRowHoverSx,
                          cursor: 'default'
                        }}
                      >
                        <CustomAvatar skin='light' color='info' size={40}>
                          <i className='ri-file-text-line' />
                        </CustomAvatar>
                        <Box className='flex-1 min-is-0'>
                          <Typography className='font-medium truncate'>{file.name}</Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {file.folder} · {formatFileSize(file.size)}
                          </Typography>
                          <Typography variant='caption' color='text.disabled' display='block'>
                            {formatDate(file.uploadedAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </Grid>
    </Grid>
  )
}

export default Dashboard
