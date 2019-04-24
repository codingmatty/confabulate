// eslint-disable-next-line no-undef
module.exports = {
  collectCoverageFrom: [
    '{client,server}/**/*.{js,jsx}',
    '!{client,server}/**/*.test.{js,jsx}',
    '!server/db/**/*'
  ],
  projects: [
    {
      displayName: 'server',
      testEnvironment: '<rootDir>/test/server-env.js',
      testMatch: ['<rootDir>/server/**/*.test.js']
    },
    {
      displayName: 'client',
      setupFilesAfterEnv: ['./test/setup'],
      testMatch: ['<rootDir>/client/**/*.test.js']
    }
  ],
  verbose: true
};
