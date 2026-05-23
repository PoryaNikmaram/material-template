// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'

// Provider Imports
import ReactQueryProvider from './ReactQueryProvider'
import ToastProvider from './ToastProvider'
import ThemeProvider from './theme'
import { AuthBootstrap } from '@/core/auth'

// Util Imports
import { getMode, getSettingsFromCookie } from '@core/utils/serverHelpers'

type Props = ChildrenType & {
  direction: Direction
}

const RootProvider = ({ children, direction }: Props) => {
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ReactQueryProvider>
          <AuthBootstrap>
            <ThemeProvider direction={direction}>
              <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
          </AuthBootstrap>
        </ReactQueryProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default RootProvider
