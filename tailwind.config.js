/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#3b82f6', // Blue-500
                    400: '#60a5fa',
                },
                background: '#0a0a0a',
                surface: '#111111',
                surfaceHighlight: '#1a1a1a',
                border: '#262626',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        }
    },
    plugins: [],
}
