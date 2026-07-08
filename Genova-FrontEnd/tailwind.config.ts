import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00ff88',
        cyber: '#00d4ff',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['dark'],
  },
}
export default config