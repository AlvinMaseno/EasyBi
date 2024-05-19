/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit", // Enable JIT
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-purple": "#96035e",
      },
    },
    screens:{
      "xl":"4000px",
      "lg":"1000px",
      "md":"700px",
      "sm":"650px",
      "xs":"550px",
      "2xs":"450px",
      "3xs":"400px",
      "4xs":"350px"
    }
  },
  plugins: [],
};
