/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

export default {
  presets: [
    require('./shadcn.config.js')
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', ...defaultTheme.fontFamily.sans],
        'display': ['Oswald']
      },
      keyframes: {
        'dialog-in': {
          from: { opacity: 0, transform: `translate3d(-50%, -48%, 0) scale3d(0.95, 0.95, 1)` },
          to: { opacity: 1, transform: `translate3d(-50%, -50%, 0) scale3d(1, 1, 1)` },
        },
        'dialog-out': {
          from: { opacity: 1, transform: `translate3d(-50%, -50%, 0) scale3d(1, 1, 1)` },
          to: { opacity: 0, transform: `translate3d(-50%, -48%, 0) scale3d(0.95, 0.95, 1)` },
        }
      },
      animation: {
        "dialog-in": "dialog-in 0.2s ease-out",
        "dialog-out": "dialog-out 0.2s ease-out",
      },
    }
  },
  plugins: [forms],
};