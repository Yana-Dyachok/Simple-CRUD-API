import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['dist', 'coverage'], 
  },
  {
    files: ['src/**/*.ts'], 
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parser: tsParser,    
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/naming-convention': 'off',
      'prefer-object-spread': 'off',
    },
  },
];


