import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                serif: ['Fraunces', 'serif'],
            },
            colors: {
                accent: '#2C5F4E',
                'accent-light': '#38795F',
                warm: '#B8956A',
            },
        },
    },
    plugins: [],
}

export default config