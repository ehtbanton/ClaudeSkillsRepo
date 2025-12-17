module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
  '*.{css,scss,less}': ['stylelint --fix', 'prettier --write'],
  '*.prisma': ['prisma format'],
  'package.json': ['sort-package-json'],
};
