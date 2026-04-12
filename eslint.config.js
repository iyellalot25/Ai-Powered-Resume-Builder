import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // 1. Ignore build files
  globalIgnores(['dist']),

  // 2. Global settings for JS and JSX files
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react, // Register the react plugin object properly
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
  },

  // 3. Merged configurations (Hooks, Vite, and Recommended)
  ...[
    js.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],

  // 4. Custom overrides and rules
  {
    rules: {
      // Keep your existing custom rules
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // Enforce removal of curly braces for static strings
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
    },
  },
]);
