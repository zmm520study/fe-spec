import baseConfig from './eslint.config.mjs';
import vueConfig from './rules/vue'
export default [
  baseConfig,
  vueConfig,
  {
    parserOptions: {
      // https://github.com/mysticatea/vue-eslint-parser#parseroptionsparser
      parser: '@babel/eslint-parser',
    },
  },
]
