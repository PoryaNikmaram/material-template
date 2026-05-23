'use client'

// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}>
      <Typography variant='body2' color='text.secondary' component='p'>
        {`© ${new Date().getFullYear()} ${themeConfig.templateName} — تمامی حقوق محفوظ است`}
      </Typography>
    </div>
  )
}

export default FooterContent
