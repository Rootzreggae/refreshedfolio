/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  // Default ("css") lets prettier add/remove whitespace around elements it
  // judges safe from their default display. It judged wrong: it inserted a
  // space between the arrow and the text in the service-radar question grid,
  // shifting the copy right. "strict" preserves whitespace everywhere, which
  // is the only safe setting for markup with inline styles.
  htmlWhitespaceSensitivity: 'strict',
};
