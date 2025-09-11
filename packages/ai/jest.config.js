const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../../tsconfig.json');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/../../',
  }),
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/test-*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
};
