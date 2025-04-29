/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#6ACDFF',
        'blue': '#1EACE3',
        'dark-blue': '#1486B8',
        'white': '#FCFCFC',
        'dark-yellow': '#F0D500',
        'light-gray': '#E3E3E3',
        'dark-gray': '#2F2F2F',
      },
    },
  },
  plugins: [],
  // Adicionando estilos globais
  corePlugins: {
    preflight: true,
  },
  // Configuração para estilizar o DatePicker
  important: true,
  // Adicionando estilos personalizados
  theme: {
    extend: {
      // ... outras extensões existentes ...
    },
  },
} 