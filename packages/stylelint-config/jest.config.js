// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.test.js'],
    testEnvironmentOptions: {
        url: 'http://localhost/'
      },
    verbose: true
  };