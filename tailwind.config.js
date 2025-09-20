/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sage-50': '#f0f5f4',
        'sage-700': '#344b47',
        'teal-400': '#7eb6ad',
        'sky-50': '#e3f5ff',
        'slate-300': '#abbdde',
      },
      backgroundImage: {
        'sage-gradient': 'linear-gradient(135deg, #f0f5f4 0%, rgba(240, 245, 244, 0.8) 100%)',
        'teal-gradient': 'linear-gradient(135deg, #7eb6ad 0%, rgba(126, 182, 173, 0.8) 100%)',
        'sky-gradient': 'linear-gradient(135deg, #e3f5ff 0%, rgba(227, 245, 255, 0.8) 100%)',
        'emerald-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
      boxShadow: {
        'sage': '0 1px 3px 0 rgba(52, 75, 71, 0.06), 0 1px 2px -1px rgba(52, 75, 71, 0.06)',
        'sage-md': '0 4px 6px -1px rgba(52, 75, 71, 0.1), 0 2px 4px -2px rgba(52, 75, 71, 0.1)',
        'sage-lg': '0 10px 15px -3px rgba(52, 75, 71, 0.1), 0 4px 6px -4px rgba(52, 75, 71, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}