'use strict';

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      curly: ['error', 'all'],
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // В запускаемых файлах и скриптах вывод в консоль допустим
    files: ['src/server.js', 'scripts/**/*.js'],
    rules: { 'no-console': 'off' },
  },
  {
    ignores: ['node_modules/', 'dist/', 'coverage/'],
  },
];