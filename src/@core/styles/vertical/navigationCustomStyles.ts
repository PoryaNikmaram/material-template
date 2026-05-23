// MUI Imports
import type { Theme } from '@mui/material/styles'

// Util Imports
import { menuClasses, verticalNavClasses } from '@menu/utils/menuClasses'

const navigationCustomStyles = (theme: Theme) => {
  return {
    color: 'var(--mui-palette-text-primary)',
    zIndex: 'var(--drawer-z-index) !important',
    [`& .${verticalNavClasses.bgColorContainer}`]: {
      backgroundColor: 'var(--mui-palette-background-paper)'
    },
    [`& .${verticalNavClasses.header}`]: {
      paddingBlock: theme.spacing(5),
      paddingInline: theme.spacing(5.5, 4),
      borderBlockEnd: '1px solid var(--mui-palette-divider)'
    },
    [`& .${verticalNavClasses.container}`]: {
      transition: 'none',
      backgroundColor: 'var(--mui-palette-background-paper)',
      borderInlineEnd: '1px solid var(--mui-palette-divider)',
      boxShadow: 'var(--mui-customShadows-sm)',
      [`& .${verticalNavClasses.toggled}`]: {
        boxShadow: 'var(--mui-customShadows-lg)'
      }
    },
    [`& .${menuClasses.root}`]: {
      paddingBlockEnd: theme.spacing(2),
      paddingInlineEnd: theme.spacing(4)
    },
    [`& .${verticalNavClasses.backdrop}`]: {
      backgroundColor: 'var(--backdrop-color)'
    }
  }
}

export default navigationCustomStyles
