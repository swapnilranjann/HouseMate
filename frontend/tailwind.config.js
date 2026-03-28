export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'bg-main': '#f8fafc',
        'surface': '#ffffff',
        'primary': '#4f46e5', // Deep Indigo (Trustworthy, Modern Startup)
        'primary-hover': '#4338ca',
        'secondary': '#0ea5e9', // Sky Blue
        'border-color': '#e2e8f0',
        'text-main': '#0f172a', // Deep Slate
        'text-muted': '#64748b',
      }
    },
  },
  plugins: [],
}
