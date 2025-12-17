import type { Config } from 'jest';

const config: Config = {
  // Use ts-jest preset for TypeScript
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Root directory for tests
  rootDir: '.',

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.spec.ts',
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
  ],

  // Module path aliases (matching tsconfig paths)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@/middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@/models/(.*)$': '<rootDir>/src/models/$1',
    '^@/routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  },

  // Transform settings
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/types/**/*',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Global settings
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Timeout for tests (in milliseconds)
  testTimeout: 10000,

  // Maximum workers for parallel testing
  maxWorkers: '50%',

  // Reporter configuration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Watch plugins for interactive mode
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};

export default config;
