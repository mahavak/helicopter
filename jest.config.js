module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Module resolution
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/**/*.config.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Module mocking
  moduleNameMapper: {
    '^three$': '<rootDir>/tests/__mocks__/three.js',
    '^cannon-es$': '<rootDir>/tests/__mocks__/cannon-es.js'
  },
  
  // Verbose output for debugging
  verbose: true,
  
  // Test timeout
  testTimeout: 10000,
  
  // Reporter configuration for CI
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'test-results.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ],
  
  // Error handling
  errorOnDeprecated: true,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>/tests']
};