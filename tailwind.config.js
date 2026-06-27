import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // dark chocolate page background
        background: '#1f1410',
        // Berry cards + header
        surface: {
          DEFAULT: '#3a1730',
          elevated: '#4a2040',
        },
        foreground: '#f4ece7', // warm white text
        muted: '#c0adba',
        line: '#4a3550', // purple-tinted divider
        // rose accent (locked)
        accent: {
          DEFAULT: '#e0759a',
          foreground: '#1f1410',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '3px', // material-throwback: nearly square
      },
    },
  },
  plugins: [animate],
};
