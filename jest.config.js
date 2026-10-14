module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: ['src/core/**/*.{ts,tsx}', 'src/design/**/*.{ts,tsx}'],
};
