/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ["<rootDir>/."],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
    coverageReporters: ['json', 'lcov'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        "**/*.{js,jsx,ts}",
        "!**/node_modules/**",
        "!**/dist/**"
      ]
};

process.env = Object.assign(process.env, {    
  APPINSIGHTS_INSTRUMENTATIONKEY: "95c3d0e3-d463-4a8d-a496-f22e9806bb8b",
  WEBSITE_HOSTNAME: "localhost",
  BASIC_AUTH_USERNAME: "testUser",
  BASIC_AUTH_PASSWORD: "testPassword",
})