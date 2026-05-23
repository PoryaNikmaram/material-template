'use client'

import { useEffect } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/providers/useToast'
import { createUser, updateUser } from '@/features/users/api'
import { usersQueryKeys } from '@/features/users/api/queryKeys'
import { useUserQuery } from '@/features/users/hooks/useUsersQuery'
import {
  createEmptyValues,
  createUserSchema,
  editUserSchema,
  USER_JOBS,
  USER_ROLES,
  USER_ROLE_LABELS,
  type CreateUserFormValues,
  type EditUserFormValues
} from '@/features/users/types/users.schema'

type UserDialogProps = {
  open: boolean
  userId?: string
  onClose: () => void
}

type UserFormValues = EditUserFormValues & {
  password?: string
  confirmPassword?: string
}

const UserDialog = ({ open, userId, onClose }: UserDialogProps) => {
  const isEdit = Boolean(userId)
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { data: user, isLoading: isLoadingUser } = useUserQuery(isEdit && open ? userId : undefined)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: createEmptyValues,
    mode: 'onTouched'
  })

  useEffect(() => {
    if (!open) return

    if (isEdit && user) {
      reset({
        nationalId: user.nationalId ?? '',
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        job: USER_JOBS.includes(user.job as (typeof USER_JOBS)[number])
          ? (user.job as (typeof USER_JOBS)[number])
          : USER_JOBS[0],
        address: user.address ?? '',
        phoneNumber: user.phoneNumber ?? '',
        fatherName: user.fatherName ?? '',
        officeNumber: user.officeNumber ?? '',
        bankAccountNumber: user.bankAccountNumber ?? '',
        registrationNumber: user.registrationNumber ?? '',
        description: user.description ?? '',
        email: user.email ?? '',
        username: user.username ?? '',
        role: USER_ROLES.includes(user.role as (typeof USER_ROLES)[number])
          ? (user.role as (typeof USER_ROLES)[number])
          : USER_ROLES[1],
        isActive: user.isActive
      })
    } else if (!isEdit) {
      reset(createEmptyValues)
    }
  }, [open, isEdit, user, reset])

  const saveMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      if (isEdit && userId) {
        return updateUser(userId, values)
      }

      const { confirmPassword, ...payload } = values as CreateUserFormValues

      void confirmPassword

      return createUser(payload)
    },
    onSuccess: () => {
      showToast({
        message: isEdit ? 'کاربر با موفقیت به‌روزرسانی شد' : 'ایجاد کاربر انجام شد',
        severity: 'success'
      })
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
      onClose()
    }
  })

  const isPending = saveMutation.isPending || isSubmitting || (isEdit && isLoadingUser)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>{isEdit ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}</DialogTitle>
      <form onSubmit={handleSubmit(values => saveMutation.mutate(values))} noValidate autoComplete='off'>
        <DialogContent className='pbs-4'>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='firstName'
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='lastName'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='نام خانوادگی'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='fatherName'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='نام پدر'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='nationalId'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='کد ملی'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='username'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='نام کاربری'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='ایمیل'
                    type='email'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='role'
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={Boolean(fieldState.error)}>
                    <InputLabel>نقش</InputLabel>
                    <Select
                      {...field}
                      label='نقش'
                      renderValue={value =>
                        USER_ROLE_LABELS[value as (typeof USER_ROLES)[number]] ?? String(value)
                      }
                    >
                      {USER_ROLES.map(role => (
                        <MenuItem key={role} value={role}>
                          {USER_ROLE_LABELS[role]}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='job'
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={Boolean(fieldState.error)}>
                    <InputLabel>شغل</InputLabel>
                    <Select {...field} label='شغل'>
                      {USER_JOBS.map(job => (
                        <MenuItem key={job} value={job}>
                          {job}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='phoneNumber'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='شماره تماس'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='officeNumber'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='شماره داخلی'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='bankAccountNumber'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='شماره حساب بانکی'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='registrationNumber'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='شماره ثبت'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='address'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='آدرس'
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='توضیحات'
                    fullWidth
                    multiline
                    rows={3}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='isActive'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
                    label='کاربر فعال'
                  />
                )}
              />
            </Grid>
            {!isEdit && (
              <>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label='رمز عبور'
                        type='password'
                        fullWidth
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label='تکرار رمز عبور'
                        type='password'
                        fullWidth
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            انصراف
          </Button>
          <Button variant='contained' type='submit' disabled={isPending}>
            {isPending ? 'در حال ذخیره...' : 'ذخیره'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UserDialog
