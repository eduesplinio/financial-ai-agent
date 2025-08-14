const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './apps/web',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'apps/**/*.{js,jsx,ts,tsx}',
    'packages/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/apps/web/$1',
    '^@/shared/(.*)$': '<rootDir>/packages/shared/src/$1',
    '^@/database/(.*)$': '<rootDir>/packages/database/src/$1',
    '^@/ai/(.*)$': '<rootDir>/packages/ai/src/$1',
    '^@/open-finance/(.*)$': '<rootDir>/packages/open-finance/src/$1',
  },
  projects: [
    {
      displayName: 'web',
      testMatch: ['<rootDir>/apps/web/**/*.test.{js,jsx,ts,tsx}'],
    },
    {
      displayName: 'packages',
      testMatch: ['<rootDir>/packages/**/*.test.{js,jsx,ts,tsx}'],
    },
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);