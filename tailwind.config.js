/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
                prompt: ['Prompt', 'sans-serif'],
                fugaz: ['"Fugaz One"', 'sans-serif'],
                onest: ['Onest', 'sans-serif'],
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
