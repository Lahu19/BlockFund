/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
      },
      colors: {
        'primary-dark': '#13131a',
        'secondary-dark': '#1c1c24',
        'tertiary-dark': '#2c2f32',
        'accent-dark': '#3a3a43',
        'text-primary': '#ffffff',
        'text-secondary': '#808191',
        'text-accent': '#b2b3bd',
        'success': '#1dc071',
        'primary-button': '#8c6dfd',
        'primary-button-hover': '#7c5dfd',
      },
      boxShadow: {
        secondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
      },
    },
  },
  plugins: [],
}
