/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.{ts,tsx}"],
  theme: {
    extend:{
      colors:{
        "dark":{
          "600":"#22222d",
          "700":"#111117"
        },
        "klein":{ //克莱因蓝
          "light":"#002ea6",
          "600": "#002ea6",
          "700": "#01227a"
        },
        "napoli": { //拿坡里黄
          "light": "#ffe78f",
          "600": "#ffe78f",
          "700": "#fee27f"
        },
        "pink":{  //猛男粉
          "light": "#f9c1d2",
          "600": "#f9c1d2",
          "700": "#f99fbb"
        }
      }
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Georgia", "serif"]
    }
  },
  variants: { extend: { typography: ["dark"] } },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
}
