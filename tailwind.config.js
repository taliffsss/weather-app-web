/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "weather-primary": "#075985",
        "weather-secondary": "#0891b2",
      },
      placeholderColor: {
        'search': '#f8fafc'
      },
      backgroundImage: theme => ({
        'cloud-bg': "url('https://cdn.mywanderlinx.com/assets/images/noaa-XCkao3y6Gpc-unsplash.jpg')"
      })
    },
    fontFamily: {
      Roboto: ["Roboto, sans-serif"],
    },
    container: {
      padding: "2rem",
      center: true,
    },
    screens: {
      sm: "640px",
      md: "768px",
    },
  },
  plugins: [],
}