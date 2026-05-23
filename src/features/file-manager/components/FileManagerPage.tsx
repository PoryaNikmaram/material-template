'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

// Component Imports
import FadeIn from '@components/ui/FadeIn'
import { useToast } from '@/providers/useToast'

// API Imports
import { deleteFile, filesQueryKeys, formatFileSize, getFiles, uploadFile } from '@/features/file-manager/api'
import type { FileItem, UploadFilePayload } from '@/features/file-manager/types/files.types'
import { uploadFileSchema, type UploadFileFormValues } from '@/features/file-manager/types/files.schema'

const SKELETON_ROWS = 4
const OPTIMISTIC_PREFIX = 'optimistic-'

const tableRowHoverSx = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgb(var(--mui-mainColorChannels-light) / 0.08)',
    bgcolor: 'action.hover'
  }
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'ri-image-line'
  if (mimeType.includes('pdf')) return 'ri-file-pdf-line'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'ri-file-excel-line'
  if (mimeType.includes('word')) return 'ri-file-word-line'

  return 'ri-file-line'
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

const isOptimisticFile = (id: string) => id.startsWith(OPTIMISTIC_PREFIX)

const FileListSkeleton = () => (
  <Box className='flex flex-col gap-3'>
    {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
      <Box key={index} className='flex items-center gap-4 p-4 rounded border border-[var(--border-color)]'>
        <Skeleton variant='circular' width={40} height={40} animation='wave' />
        <Box className='flex-1'>
          <Skeleton width='40%' className='mbe-2' animation='wave' />
          <Skeleton width='25%' animation='wave' />
        </Box>
        <Skeleton variant='circular' width={32} height={32} animation='wave' />
      </Box>
    ))}
  </Box>
)

const QueryErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Box className='flex flex-col items-center justify-center gap-3 py-12'>
    <i className='ri-error-warning-line text-5xl text-error' />
    <Typography color='error'>خطا در بارگذاری فایل‌ها</Typography>
    <Button variant='outlined' color='error' onClick={onRetry}>
      تلاش مجدد
    </Button>
  </Box>
)

const FileManager = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const startProgressSimulation = () => {
    setUploadProgress(0)

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    progressIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0
        if (prev >= 90) return prev

        return prev + 8
      })
    }, 180)
  }

  const stopProgressSimulation = (complete = false) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    if (complete) {
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(null), 500)
    } else {
      setUploadProgress(null)
    }
  }

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onMutate: async (payload: UploadFilePayload) => {
      startProgressSimulation()
      await queryClient.cancelQueries({ queryKey: filesQueryKeys.all })

      const previousFiles = queryClient.getQueryData<FileItem[]>(filesQueryKeys.all)

      const optimisticFile: FileItem = {
        id: `${OPTIMISTIC_PREFIX}${Date.now()}`,
        name: payload.name,
        size: payload.size,
        mimeType: payload.mimeType || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        folder: 'در حال آپلود'
      }

      queryClient.setQueryData<FileItem[]>(filesQueryKeys.all, old => [optimisticFile, ...(old ?? [])])

      return { previousFiles, optimisticId: optimisticFile.id }
    },
    onSuccess: () => {
      stopProgressSimulation(true)
      showToast({ message: 'آپلود فایل انجام شد', severity: 'success' })
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    onError: (_error, _payload, context) => {
      stopProgressSimulation(false)

      if (context?.previousFiles) {
        queryClient.setQueryData(filesQueryKeys.all, context.previousFiles)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: filesQueryKeys.all })
    }
  })

  const { handleSubmit, reset, formState } = useForm<UploadFileFormValues>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      name: '',
      size: 0,
      mimeType: ''
    },
    mode: 'onTouched'
  })

  const onUploadSubmit = async (values: UploadFileFormValues) => {
    await uploadMutation.mutateAsync(values)
  }

  const { data: files = [], isLoading, isError, refetch } = useQuery({
    queryKey: filesQueryKeys.all,
    queryFn: getFiles
  })

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onMutate: async (fileId: string) => {
      setDeletingId(fileId)
      await queryClient.cancelQueries({ queryKey: filesQueryKeys.all })

      const previousFiles = queryClient.getQueryData<FileItem[]>(filesQueryKeys.all)

      queryClient.setQueryData<FileItem[]>(filesQueryKeys.all, old =>
        old ? old.filter(file => file.id !== fileId) : []
      )

      return { previousFiles }
    },
    onSuccess: () => {
      showToast({ message: 'فایل با موفقیت حذف شد', severity: 'success' })
    },
    onError: (_error, _fileId, context) => {
      if (context?.previousFiles) {
        queryClient.setQueryData(filesQueryKeys.all, context.previousFiles)
      }
    },
    onSettled: () => {
      setDeletingId(null)
      queryClient.invalidateQueries({ queryKey: filesQueryKeys.all })
    }
  })

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    reset({
      name: file.name,
      size: file.size,
      mimeType: file.type
    })

    await handleSubmit(onUploadSubmit)()
  }

  const renderContent = () => {
    if (isLoading) return <FileListSkeleton />

    if (isError) {
      return <QueryErrorState onRetry={() => refetch()} />
    }

    if (files.length === 0 && !uploadMutation.isPending) {
      return (
        <Box className='flex flex-col items-center justify-center gap-2 py-12'>
          <i className='ri-folder-open-line text-6xl text-textDisabled opacity-80' />
          <Typography variant='h6'>فایلی یافت نشد</Typography>
          <Typography color='text.secondary'>اولین فایل خود را آپلود کنید.</Typography>
          <Button
            variant='contained'
            className='mbs-2'
            startIcon={<i className='ri-upload-2-line' />}
            onClick={() => fileInputRef.current?.click()}
          >
            آپلود فایل
          </Button>
        </Box>
      )
    }

    return (
      <Box className='flex flex-col gap-3'>
        {files.map((file: FileItem) => {
          const uploading = isOptimisticFile(file.id)

          return (
            <Box
              key={file.id}
              className='flex flex-col gap-2 p-4 rounded border border-[var(--border-color)]'
              sx={{
                ...tableRowHoverSx,
                opacity: uploading ? 0.85 : 1,
                transition: 'opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <Box className='flex flex-wrap items-center gap-4'>
                <Box
                  className='flex items-center justify-center rounded'
                  sx={{ width: 40, height: 40, bgcolor: 'action.hover' }}
                >
                  <i
                    className={`${uploading ? 'ri-loader-4-line animate-spin' : getFileIcon(file.mimeType)} text-xl`}
                  />
                </Box>
                <Box className='flex-1 min-is-0'>
                  <Typography className='font-medium truncate'>{file.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {uploading
                      ? `در حال آپلود${uploadProgress !== null ? ` · ${uploadProgress}%` : ''}`
                      : `${formatFileSize(file.size)} · ${file.folder} · ${formatDate(file.uploadedAt)}`}
                  </Typography>
                </Box>
                {!uploading && (
                  <Tooltip title='حذف فایل'>
                    <span>
                      <IconButton
                        size='small'
                        color='error'
                        disabled={deletingId === file.id}
                        onClick={() => deleteMutation.mutate(file.id)}
                      >
                        <i
                          className={
                            deletingId === file.id ? 'ri-loader-4-line animate-spin' : 'ri-delete-bin-7-line'
                          }
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>
              {uploading && (
                <LinearProgress
                  variant={uploadProgress !== null ? 'determinate' : 'indeterminate'}
                  value={uploadProgress ?? 0}
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <FadeIn>
    <Card>
      <CardContent sx={{ transition: 'opacity 0.35s ease', opacity: isLoading ? 0.7 : 1 }}>
        <Box className='flex flex-wrap items-center justify-between gap-4 mbe-4'>
          <div>
            <Typography variant='h4' className='mbe-1'>
              مدیریت فایل‌ها
            </Typography>
            <Typography color='text.secondary'>مرور، آپلود و حذف فایل‌ها با شبیه‌سازی API</Typography>
          </div>
          <Button
            variant='contained'
            startIcon={
              uploadMutation.isPending ? (
                <i className='ri-loader-4-line animate-spin' />
              ) : (
                <i className='ri-upload-2-line' />
              )
            }
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || uploadMutation.isPending || formState.isSubmitting}
          >
            {uploadMutation.isPending ? 'در حال آپلود...' : 'آپلود فایل'}
          </Button>
          <input ref={fileInputRef} type='file' hidden onChange={handleFileSelect} />
        </Box>

        <Collapse in={uploadProgress !== null && !files.some(f => isOptimisticFile(f.id))}>
          <LinearProgress
            variant='determinate'
            value={uploadProgress ?? 0}
            className='mbe-4'
            sx={{ borderRadius: 1 }}
          />
        </Collapse>

        {renderContent()}
      </CardContent>
    </Card>
    </FadeIn>
  )
}

export default FileManager
