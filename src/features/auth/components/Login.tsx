'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'

// API Imports
import { login } from '@/features/auth/api'
import { authDebug, completeLoginSession } from '@/core/auth'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/shared/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Schema Imports
import { signInSchema, type SignInFormValues } from '@/features/auth/types/auth.schema'

const Login = ({ mode }: { mode: Mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  const router = useRouter()
  const queryClient = useQueryClient()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      nationalId: '',
      password: '',
      rememberMe: false
    },
    mode: 'onTouched'
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async data => {
      await completeLoginSession(data, queryClient)
      router.push('/')
    },
    onError: error => {
      authDebug.loginFailure({ message: error instanceof Error ? error.message : 'unknown' })
    }
  })

  const onSubmit = async (values: SignInFormValues) => {
    await loginMutation.mutateAsync({
      nationalId: values.nationalId,
      password: values.password
    })
  }

  const isPending = loginMutation.isPending || isSubmitting

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{`خوش آمدید به ${themeConfig.templateName}! 👋`}</Typography>
              <Typography className='mbs-1'>لطفاً وارد حساب کاربری خود شوید</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <Controller
                name='nationalId'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='کد ملی'
                    inputMode='numeric'
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name='password'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='رمز عبور'
                    id='outlined-adornment-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <Controller
                  name='rememberMe'
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />
                      }
                      label='مرا به خاطر بسپار'
                    />
                  )}
                />
                <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                  فراموشی رمز عبور؟
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={isPending}>
                {isPending ? 'در حال ورود...' : 'ورود'}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>حساب کاربری ندارید؟</Typography>
                <Typography component={Link} href='/register' color='primary'>
                  ثبت‌نام
                </Typography>
              </div>
              <Divider className='gap-3'>یا</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton size='small' className='text-facebook'>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton size='small' className='text-twitter'>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton size='small' className='text-github'>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton size='small' className='text-googlePlus'>
                  <i className='ri-google-fill' />
                </IconButton>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
