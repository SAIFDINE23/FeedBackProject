import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                luminea: {
                    50: '#f8f7ff',
                    100: '#f0eefe',
                    200: '#e1dcfd',
                    300: '#d2cbfc',
                    400: '#b3a9f7',
                    500: '#9487f3',
                    600: '#764ba2',
                    700: '#667eea',
                    800: '#554da2',
                    900: '#443b7f',
                },
            },
            backgroundImage: {
                'luminea-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
        },
    },

    plugins: [forms],
};
