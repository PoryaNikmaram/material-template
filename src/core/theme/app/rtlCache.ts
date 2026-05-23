import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

export const rtlEmotionCacheOptions = {
  prepend: true,
  key: 'mui-rtl',
  stylisPlugins: [prefixer, rtlPlugin]
}
