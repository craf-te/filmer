import { FlatCompat } from '@eslint/eslintrc'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import js from '@eslint/js'
import typeScriptESLintParser from '@typescript-eslint/parser'

const compat = new FlatCompat()

export default [
  {
    ignores: ['dist']
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...compat.extends(
    'standard-with-typescript',
    'plugin:@typescript-eslint/eslint-recommended'
  ),
  ...compat.plugins(
    'import',
    'unused-imports'
  ),
  {
    files: ['src/**/*.ts'],
    plugins: {
      typescriptEslint
    },
    languageOptions: {
      parser: typeScriptESLintParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    },
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      'unused-imports/no-unused-imports': 'error',
      'import/prefer-default-export': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'object', 'type', 'index'],
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    }
  }
]
