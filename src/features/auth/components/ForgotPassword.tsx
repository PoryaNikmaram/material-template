'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Third-party Imports
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'

// API Imports
import { forgotPassword } from '@/features/auth/api'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import DirectionalIcon from '@components/shared/DirectionalIcon'
import Illustrations from '@components/shared/Illustrations'
import Logo from '@components/layout/shared/Logo'
import { useToast } from '@/providers/useToast'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Schema Imports
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/types/auth.schema'

const ForgotPassword = ({ mode }: { mode: Mode }) => {
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { showToast } = useToast()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    },
    mode: 'onTouched'
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      showToast({
        message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد',
        severity: 'success'
      })
    }
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await forgotPasswordMutation.mutateAsync({ email: values.email })
  }

  const isPending = forgotPasswordMutation.isPending || isSubmitting

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <Typography variant='h4'>فراموشی رمز عبور 🔒</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>
              ایمیل خود را وارد کنید تا دستورالعمل بازیابی رمز عبور برای شما ارسال شود
            </Typography>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <Controller
                name='email'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='ایمیل'
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Button fullWidth variant='contained' type='submit' disabled={isPending}>
                {isPending ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
              </Button>
              <Typography className='flex justify-center items-center' color='primary'>
                <Link href='/login' className='flex items-center'>
                  <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
                  <span>بازگشت به ورود</span>
                </Link>
              </Typography>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default ForgotPassword
