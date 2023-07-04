import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import flowbite from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Montserrat', ...defaultTheme.fontFamily.sans],
      'display': ['Oswald']
    }
  },
  plugins: [
    forms,
    flowbite
  ],
};
