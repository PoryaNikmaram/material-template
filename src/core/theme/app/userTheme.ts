/*
 * Optional fully custom theme. Prefer mergedTheme.ts for most overrides.
 * Import in `@/providers/theme` only if replacing defaultCoreTheme entirely.
 */

// MUI Imports
import type { Theme } from '@mui/material/styles'

const userTheme = (): Theme => {
  return {
    // Write your custom theme object here.
  } as Theme
}

export default userTheme
