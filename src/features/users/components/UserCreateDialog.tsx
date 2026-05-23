'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

// Third-party Imports
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import type { UseMutationResult } from '@tanstack/react-query'

// API Imports
import type { CreateUserPayload, User } from '@/features/users/types/users.types'

// Schema Imports
import { createUserSchema, type CreateUserFormValues } from '@/features/users/types/users.schema'

type UserCreateDialogProps = {
  open: boolean
  onClose: () => void
  createMutation: UseMutationResult<User, unknown, CreateUserPayload, unknown>
}

const defaultValues: CreateUserFormValues = {
  name: '',
  email: '',
  role: 'کاربر'
}

const UserCreateDialog = ({ open, onClose, createMutation }: UserCreateDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
    mode: 'onTouched'
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues)
    }
  }, [open, reset])

  const onSubmit = async (values: CreateUserFormValues) => {
    await createMutation.mutateAsync(values)
  }

  const isPending = createMutation.isPending || isSubmitting

  return (
    <Dialog open={open} onClose={() => !isPending && onClose()} fullWidth maxWidth='sm'>
      <DialogTitle>افزودن کاربر جدید</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete='off'>
        <DialogContent className='flex flex-col gap-4 pbs-4'>
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='نام'
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='ایمیل'
                fullWidth
                type='email'
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name='role'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='نقش'
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            انصراف
          </Button>
          <Button variant='contained' type='submit' disabled={isPending}>
            {isPending ? (
              <>
                <i className='ri-loader-4-line animate-spin mie-2' />
                در حال ذخیره...
              </>
            ) : (
              'ذخیره'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UserCreateDialog
