module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Module resolution
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test patterns - exclude integration tests for CI
  testMatch: [
    '<rootDir>/tests/features/**/*.test.js'
  ],
  
  // Explicitly exclude problematic tests
  testPathIgnorePatterns: [
    '<rootDir>/tests/integration/',
    '<rootDir>/tests/performance/',
    '<rootDir>/node_modules/'
  ],
  
  // Coverage configuration - disabled for CI to avoid permission issues
  collectCoverage: false,
  
  // Module mocking
  moduleNameMapper: {
    '^three$': '<rootDir>/tests/__mocks__/three.js',
    '^cannon-es$': '<rootDir>/tests/__mocks__/cannon-es.js'
  },
  
  // Less verbose for CI
  verbose: false,
  
  // Test timeout
  testTimeout: 30000,
  
  // Reporter configuration for CI
  reporters: [
    'default'
  ],
  
  // Error handling
  errorOnDeprecated: false,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>/tests'],
  
  // Silence console output in CI
  silent: false,
  
  // Force exit after tests complete
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: false
};