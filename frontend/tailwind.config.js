/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        page:    '#0B0D14',
        surface: '#0F1117',
        card:    '#141720',
        accent: {
          DEFAULT: '#5B4EE8',
          hover:   '#4F44D4',
          light:   'rgba(91,78,232,0.15)',
          text:    '#A78BFA',
        },
        income:  '#34D399',
        expense: '#F87171',
        warn:    '#FBBF24',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn:  '10px',
        icon: '10px',
      },
      fontSize: {
        '2xs': '10px',
        'xs':  '11px',
        'sm':  '12px',
        'base':'13px',
        'md':  '14px',
        'lg':  '16px',
        'xl':  '18px',
        '2xl': '22px',
        'hero':'28px',
      },
      boxShadow: {
        card:      '0 1px 3px rgba(0,0,0,0.4)',
        cardHover: '0 4px 12px rgba(0,0,0,0.5)',
        glow:      '0 0 20px rgba(91,78,232,0.3)',
      },
    },
  },
  plugins: [],
}
