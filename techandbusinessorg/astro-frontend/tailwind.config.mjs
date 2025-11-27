/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'tb-black': '#000000',
                'tb-white': '#FFFFFF',
                'tb-gray-dark': '#1a1a1a',
                'tb-gray-medium': '#333333',
                'tb-gray-light': '#666666',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
