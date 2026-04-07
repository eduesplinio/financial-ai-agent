const path = require('path');
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: path.join(__dirname),
});

const customJestConfig = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/app/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/lib/**/*.test.{js,jsx,ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/open-finance/(.*)$': '<rootDir>/../../packages/open-finance/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
