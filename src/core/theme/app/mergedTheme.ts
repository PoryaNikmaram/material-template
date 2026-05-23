/*
 * Merge overrides with the Materio core theme (@core/theme).
 * Import from `@/core/theme/app/mergedTheme` when customizing ThemeProvider.
 */

// MUI Imports
import { deepmerge } from '@mui/utils'
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Core Theme Imports
import coreTheme from '@core/theme'

const mergedTheme = (settings: Settings, mode: SystemMode, direction: Theme['direction']) => {
  const userTheme = {
    // Write your overrides here.
  } as Theme

  return deepmerge(coreTheme(mode, direction), userTheme)
}

export default mergedTheme
