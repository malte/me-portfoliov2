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
      extend: {
        typography: {
          DEFAULT: {
            dark: {
              css: {
                  color: '#fff'
              }
            },
            css: {
              lineHeight:'1.5',
              p: {
                maxWidth: '65ch'
              },
              li: {
                maxWidth: '65ch'
              },
              a: {
                color: 'rgb(109, 40, 217)',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            },
          },
        }
      },
    },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
