module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['>0.25%', 'not dead', 'not ie 11'],
        },
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false,
      },
    ],
    [
      '@babel/preset-typescript',
      {
        isTSX: true,
        allExtensions: true,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development',
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    process.env.NODE_ENV === 'development' && 'react-refresh/babel',
  ].filter(Boolean),
  env: {
    production: {
      plugins: [
        ['transform-react-remove-prop-types', { removeImport: true }],
      ],
    },
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
    },
  },
};
