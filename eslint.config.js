import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typeScriptESLintParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

const compat = new FlatCompat();

export default [
  {
    ignores: ['dist'],
  },
  js.configs.recommended,
  ...compat.extends('standard-with-typescript', 'plugin:@typescript-eslint/eslint-recommended'),
  eslintConfigPrettier,
  ...compat.plugins('import', 'unused-imports'),
  {
    files: ['src/**/*.ts'],
    plugins: {
      typescriptEslint,
    },
    languageOptions: {
      parser: typeScriptESLintParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
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
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
