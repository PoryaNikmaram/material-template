'use client'

// React Imports
import type { CSSProperties } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

type LogoTextProps = {
  color?: CSSProperties['color']
}

const LogoText = styled.span<LogoTextProps>`
  color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
  font-size: 1.125rem;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: 0;
  margin-inline-start: 10px;
`

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  return (
    <div className='flex items-center min-bs-[24px]'>
      <i className='ri-building-4-line text-[22px] text-primary' aria-hidden />
      <LogoText color={color}>{themeConfig.templateName}</LogoText>
    </div>
  )
}

export default Logo
