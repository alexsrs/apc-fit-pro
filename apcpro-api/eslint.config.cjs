// ESLint flat config (CommonJS) para ESLint v9
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // Ignora pastas e arquivos não relevantes para o lint
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '**/*.js', '**/*.cjs', '**/*.mjs'],
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  // Override específico para arquivo com tipos/resultados não utilizados por design
  {
    files: ['src/services/dobras-cutaneas-service.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
