// Next Imports
import { Vazirmatn } from 'next/font/google'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Config Imports
import { appDirection } from '@configs/directionConfig'

// Provider Imports
import RootProvider from '@/providers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import 'remixicon/fonts/remixicon.css'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-vazirmatn',
  display: 'swap'
})

export const metadata = {
  title: 'آراسافت — سامانه مدیریت سازمانی',
  description: 'پلتفرم مدیریت کاربران و فایل‌های سازمانی'
}

const RootLayout = ({ children }: ChildrenType) => {
  return (
    <html id='__next' dir={appDirection} lang='fa' className={vazirmatn.variable}>
      <body className={`${vazirmatn.className} flex is-full min-bs-full flex-auto flex-col`}>
        <RootProvider direction={appDirection}>{children}</RootProvider>
      </body>
    </html>
  )
}

export default RootLayout
