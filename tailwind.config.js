/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            /* ===============================
               BACKGROUND GRADIENT
            =============================== */
            backgroundImage: {
                'gradient-radial':
                    'radial-gradient(circle at center, var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },

            /* ===============================
               FONT FAMILY (Next Font Variables)
            =============================== */
            fontFamily: {
                prompt: ['var(--font-prompt)'],
                fugaz: ['var(--font-fugaz)'],
                onest: ['var(--font-onest)'],
            },

            /* ===============================
               ANIMATION
            =============================== */
            animation: {
                float: 'float 4s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};
