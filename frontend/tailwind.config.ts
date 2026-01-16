import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - 落ち着いたブルー
        primary: {
          DEFAULT: '#4A6FA5',
          light: '#7B9FD6',
          dark: '#2C4A7C',
          50: '#F0F4FA',
          100: '#D9E4F4',
          200: '#B3C9E9',
          300: '#8DADDD',
          400: '#6792D2',
          500: '#4A6FA5',
          600: '#3B5984',
          700: '#2C4363',
          800: '#1D2C42',
          900: '#0E1621',
        },
        // Secondary - ティール（成功/ポジティブ）
        teal: {
          DEFAULT: '#4DB6AC',
          light: '#80CBC4',
          dark: '#00897B',
        },
        // Amber（警告）
        amber: {
          DEFAULT: '#FFB74D',
          light: '#FFE082',
          dark: '#FF8F00',
        },
        // Rose（エラー/ネガティブ）
        rose: {
          DEFAULT: '#E57373',
          light: '#EF9A9A',
          dark: '#D32F2F',
        },
        // Background
        background: {
          DEFAULT: '#FAFBFC',
          surface: '#FFFFFF',
          muted: '#F1F5F9',
        },
        // Text
        text: {
          DEFAULT: '#1E293B',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
        // Dark mode
        dark: {
          background: '#0F172A',
          surface: '#1E293B',
          text: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        'h1': ['2rem', { lineHeight: '1.2' }],
        'h2': ['1.5rem', { lineHeight: '1.3' }],
        'h3': ['1.25rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
