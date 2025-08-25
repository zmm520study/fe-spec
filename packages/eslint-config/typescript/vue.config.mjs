import baseConfig from './index.config.mjs';
import vueConfig from '../rules/vue'
export default [
  baseConfig,
  vueConfig,
  {
    parserOptions:{
      // https://github.com/mysticatea/vue-eslint-parser#parseroptionsparser
      parser: '@typescript-eslint/parser',
    },
  }
]



