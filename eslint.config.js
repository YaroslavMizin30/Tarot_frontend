import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // errors
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-undef': 'error',
      'no-use-before-define': 'error',
      'no-implicit-globals': 'error',
      'no-global-assign': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-extra-bind': 'error',
      'no-invalid-this': 'error',
      'no-extend-native': 'error',
      'no-loop-func': 'error',
      'no-param-reassign': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-void': 'error',
      'require-await': 'error',
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',

      //style
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'never',
          objects: 'only-multiline',
          imports: 'never',
          exports: 'never',
          functions: 'only-multiline',
          importAttributes: 'never',
          dynamicImports: 'never',
          enums: 'never',
          generics: 'never',
          tuples: 'never',
        },
      ],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/dot-location': ['error', 'object'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/jsx-closing-bracket-location': ['error'],
      '@stylistic/jsx-closing-tag-location': ['error'],
      '@stylistic/jsx-curly-brace-presence': ['error', { props: 'always' }],
      '@stylistic/jsx-curly-spacing': ['error', { when: 'never' }],
      '@stylistic/jsx-equals-spacing': ['error', 'never'],
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
      '@stylistic/jsx-indent': ['error', 2],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-max-props-per-line': [
        'error',
        { maximum: 3, when: 'multiline' },
      ],
      '@stylistic/jsx-pascal-case': ['error'],
      '@stylistic/jsx-props-no-multi-spaces': ['error'],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/jsx-wrap-multilines': ['error', { assignment: 'parens' }],
      '@stylistic/key-spacing': ['error', { beforeColon: false }],
      '@stylistic/no-multi-spaces': 'error',
    },
  },
]);
