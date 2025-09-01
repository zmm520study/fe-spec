import eslintNodeConfig from 'web-eslint-config/typescript/node'
import eslintPrettierConfig from 'eslint-config-prettier'
export default [
    {
     ignores: ['**/node_modules/**','lib/*','test/*','src/config/*'],
    },
    eslintNodeConfig,
    eslintPrettierConfig,
    {
        rules: {
            '@typescript-eslint/no-require-imports': 0,
            'no-console': 0,
          },
    }
]

  