// eslint-disable-next-line no-undef
module.exports = {
  verbose: true,
  projects: [
    {
      displayName: 'server',
      testMatch: ['<rootDir>/server/**/*.test.js']
    },
    {
      displayName: 'client',
      testMatch: ['<rootDir>/client/**/*.test.js'],
      setupFilesAfterEnv: ['./tests/setup']
    }
  ],
  collectCoverageFrom: ['{client,server}/**/*.{js,jsx}', '!server/db/**/*']
};
