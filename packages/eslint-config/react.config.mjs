import baseConfig from './eslint.config.mjs';
import reactConfig from './rules/react'
export default [
  baseConfig,
  reactConfig,
  {
    parserOptions: {
      babelOptions: {
        presets: ['@babel/preset-react'],
      },
    },
  }
]

