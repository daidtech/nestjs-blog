const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^.+\\.(css|scss|sass|less)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
};

module.exports = createJestConfig(customJestConfig);
