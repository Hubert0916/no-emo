// https://docs.expo.dev/guides/using-eslint/
// eslint.config.js
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const pluginReact = require('eslint-plugin-react');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = defineConfig([
  expoConfig,

  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        'babel-module': {},
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'warn',
      'no-undef': 'off',
    },
  },

  {
    ignores: ['dist/*'],
  },
]);
