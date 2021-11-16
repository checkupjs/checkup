module.exports = {
  testEnvironment: 'jest-environment-node-single-context',
  moduleFileExtensions: ['ts', 'js', 'json', 'tsx'],
  transform: { '^.+\\.(ts)x?$': 'ts-jest' },
  coverageReporters: ['lcov', 'text-summary'],
  // collectCoverage: !!process.env.CI,
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/templates/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/__utils__/', '__fixtures__'],
};
