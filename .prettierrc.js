module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  overrides: [
      {
          files: ['*.js', '*.ts', '*.jsx', '*.tsx'],
          options: {
              tabWidth: 4,
          },
      },
  ],
};
