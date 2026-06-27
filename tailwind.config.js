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
        muted: '#c6c2cc', // secondary text (lighter grey so it doesn't blend into Berry)
        line: '#8d8a95', // lighter grey divider/border (was purple)
        // accent: the heartbeat-loader red (replaced rose)
        accent: {
          DEFAULT: '#ff4b4b',
          foreground: '#1f1410',
        },
        // secondary blue (used as an outline color on non-Dashboard pages)
        blue: '#6ea8fe',
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
