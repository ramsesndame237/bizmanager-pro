import pluginTs from '@typescript-eslint/eslint-plugin'
import parserTs from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import parserVue from 'vue-eslint-parser'
import configPrettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: { ecmaVersion: 2023, sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': pluginTs },
    rules: {
      ...pluginTs.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // Vue files
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTs,
        ecmaVersion: 2023,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      vue: pluginVue,
    },
    rules: {
      ...pluginTs.configs['recommended'].rules,
      ...pluginVue.configs['vue3-recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.output/**',
      '**/.nuxt/**',
      '**/target/**',
      '**/coverage/**',
    ],
  },
  // Prettier (must be last)
  configPrettier,
]
