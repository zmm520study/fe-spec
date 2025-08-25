import globals from 'globals';
// import pluginJs from '@eslint/js';
// import tseslint from '@typescript-eslint/eslint-plugin';
// import tsParser from '@typescript-eslint/parser';
// import pluginReact from 'eslint-plugin-react';
// import pluginVue from 'eslint-plugin-vue';
// import importPlugin from 'eslint-plugin-import';

// 导入自定义规则
import baseBestPractices from './rules/base/best-practices.js';
import baseErrors from './rules/base/possible-errors.js';
import baseStyle from './rules/base/style.js';
import baseVariables from './rules/base/variables.js';
import baseEs6 from './rules/base/es6.js';
import baseStrict from './rules/base/strict.js';
import importsRules from './rules/imports.js';

export default [
  { ignores: ['node_modules/', 'dist/', 'build/', 'coverage/'] },

  // 基础配置
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      parser: await import('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          globalReturn: false,
          impliedStrict: true,
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
  },

  // 导入所有自定义规则
  baseBestPractices,
  baseErrors,
  baseStyle,
  baseVariables,
  baseEs6,
  baseStrict,
  importsRules,
];
