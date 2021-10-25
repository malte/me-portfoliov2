module.exports = {
  mode: 'jit',
  purge: {
    // enabled: true,
    content: [
      './src/**/*.njk',
      './src/**/*.md',
      './src/**/*.js',
      './.*.js',
      // './public/**/*.html'
    ]
  }, 
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      'darkmodeOn': ['darkmode-on', "Helvetica Neue", "Noto Sans", 'sans-serif'],
      'darkmodeOff': ['darkmode-off', "Helvetica Neue", "Noto Sans", 'sans-serif']
    },
  },
  variants: {
    extend: {
      fontFamily: ['dark']
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
