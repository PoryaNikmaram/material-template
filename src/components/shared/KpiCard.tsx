'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import FadeIn from '@components/ui/FadeIn'

type Props = {
  title: string
  value: string
  subtitle: string
  trend: number
  trendLabel: string
  icon: string
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
  delay?: number
  sx?: SxProps<Theme>
}

const KpiCard = ({ title, value, subtitle, trend, trendLabel, icon, color = 'primary', delay = 0, sx }: Props) => {
  const isPositive = trend >= 0

  return (
    <FadeIn delay={delay} sx={{ height: '100%', ...sx }}>
      <Card
        className='bs-full'
        sx={{
          height: '100%',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: theme => theme.shadows[4]
          }
        }}
      >
        <CardContent>
          <div className='flex justify-between items-start mbe-4'>
            <CustomAvatar color={color} skin='light' size={42}>
              <i className={icon} />
            </CustomAvatar>
            <Typography
              variant='caption'
              className='flex items-center gap-1 font-medium'
              color={isPositive ? 'success.main' : 'error.main'}
            >
              <i className={isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} />
              {`${isPositive ? '+' : ''}${trend}%`}
            </Typography>
          </div>
          <Typography variant='body2' color='text.secondary' className='mbe-1'>
            {title}
          </Typography>
          <Typography variant='h4' className='mbe-1 font-medium'>
            {value}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {subtitle}
          </Typography>
          <Typography variant='caption' color='text.disabled' className='mts-1 block'>
            {trendLabel}
          </Typography>
        </CardContent>
      </Card>
    </FadeIn>
  )
}

export default KpiCard
