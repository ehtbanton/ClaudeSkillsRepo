module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-tailwindcss',
    'stylelint-prettier/recommended',
  ],
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'scss/at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer'] },
    ],
    'declaration-block-no-redundant-longhand-properties': null,
    'custom-property-empty-line-before': null,
  },
  ignoreFiles: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
};
