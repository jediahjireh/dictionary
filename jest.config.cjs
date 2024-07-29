// jest.config.cjs

// create Jest configuration
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};