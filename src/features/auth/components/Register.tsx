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
import { Controller, useForm } from 'react-hook-form'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/shared/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Schema Imports
import { registerSchema, type RegisterFormValues } from '@/features/auth/types/auth.schema'

const Register = ({ mode }: { mode: Mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  const router = useRouter()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      acceptTerms: false
    },
    mode: 'onTouched'
  })

  const onSubmit = async () => {
    router.push('/login')
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-start mbe-6'>
            <Logo />
          </Link>
          <Typography variant='h4'>شروع ماجراجویی با {themeConfig.templateName} 🚀</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>مدیریت سازمان خود را ساده و لذت‌بخش کنید!</Typography>
            <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-5'
            >
              <Controller
                name='username'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='نام کاربری'
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
                    fullWidth
                    label='ایمیل'
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
              <Controller
                name='acceptTerms'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(field.value)}
                          onChange={(_, checked) => field.onChange(checked)}
                        />
                      }
                      label={
                        <>
                          <span>با </span>
                          <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                            قوانین و شرایط
                          </Link>
                          <span> موافقم</span>
                        </>
                      }
                    />
                    {fieldState.error ? (
                      <Typography variant='caption' color='error' className='mts-[-12px] mbs-1'>
                        {fieldState.error.message}
                      </Typography>
                    ) : null}
                  </>
                )}
              />
              <Button fullWidth variant='contained' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>قبلاً ثبت‌نام کرده‌اید؟</Typography>
                <Typography component={Link} href='/login' color='primary'>
                  ورود
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

export default Register
