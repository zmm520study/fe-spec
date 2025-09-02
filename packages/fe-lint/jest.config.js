// jest.config.js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/test/**/*.test.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(execa)/)',
  ],
  moduleNameMapping: {
    '^execa$': require.resolve('execa'),
  },
};