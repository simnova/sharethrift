/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ["<rootDir>/."],
  preset: 'ts-jest',

  globalSetup: "<rootDir>/test/global-setup.ts",
  globalTeardown: "<rootDir>/test/global-teardown.ts",
  setupFiles: [
    "<rootDir>/test/setup-env.ts"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/test/setup-file.ts"
  ],

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
  COSMOSDB : "mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255",
  COSMOSDB_DBNAME: "sharethrift-test",
  NODE_ENV: "development"
})