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
                background: '#0a0a0a',
                surface: '#121212',
                primary: '#3b82f6',
                secondary: '#64748b',
                accent: '#8b5cf6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
