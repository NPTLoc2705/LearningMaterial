/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#FBFBFA',
        bone: '#F4F3EF',
        charcoal: '#141413',
        muted: '#6B6A66',
        faint: '#9E9D97',
        border: {
          DEFAULT: '#E8E7E4',
          subtle: '#EFEFEA',
        },
        pastel: {
          green: '#EDF3EC',
          'green-text': '#346538',
          red: '#FDEBEC',
          'red-text': '#9F2F2D',
          blue: '#E1F3FE',
          'blue-text': '#1F6C9F',
          amber: '#FBF3DB',
          'amber-text': '#956400',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Geist', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"SF Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0,0,0,0.02)',
        'diffuse': '0 4px 16px rgba(0,0,0,0.03)',
        'inner-hairline': 'inset 0 1px 1px rgba(255,255,255,0.6)',
      },
      borderRadius: {
        'bezel-outer': '1.25rem',
        'bezel-inner': '1rem',
      },
    },
  },
  plugins: [],
}
