import { defineConfig } from 'vite-plugin-windicss'
import lineClamp from 'windicss/plugin/line-clamp'

export default defineConfig({
  darkMode: 'class',
  plugins: [lineClamp],
  theme: {},
})
