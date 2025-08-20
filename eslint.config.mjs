import jsPlugin from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules', 'dist', 'build', 'generated', 'prisma/generated']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: globals.browser
    },
    rules: {}
  },
  // Tambahkan konfigurasi dari plugin JS
  {
    ...jsPlugin.configs.recommended
  },
  // Konfigurasi untuk TypeScript dengan parser dan plugin ts
  {
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'no-return-assign': 'off',
      'array-callback-return': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // abaikan argumen berawalan underscore
          varsIgnorePattern: '^_', // abaikan variabel lokal berawalan underscore
          caughtErrorsIgnorePattern: '^_' // abaikan error param di catch(error)
        }
      ]
    },
    settings: {
      // jika ada setting tambahan
    }
  }
]
