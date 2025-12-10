process.env.TZ = 'UTC';

module.exports = {
  preset: null,
  testEnvironment: 'jsdom',

  testEnvironmentOptions: {
    url: 'http://localhost/',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTest.js'],

  moduleDirectories: ['node_modules', 'src'],

  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },

  moduleNameMapper: {
  '\\.module\\.(css|scss|less)$': 'identity-obj-proxy', // MUST be first
  '\\.(css|scss|less)$': '<rootDir>/__mocks__/styleMock.js', // regular styles
  '\\.svg$': '<rootDir>/__mocks__/fileMock.js',
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    '<rootDir>/__mocks__/fileMock.js',
    //Fix for match react version in react-paragon-topaz, verify when they have the same version
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
    '^@edx/paragon$': '<rootDir>/node_modules/@edx/paragon',
},

transformIgnorePatterns: [
  '/node_modules/(?!(@edx|@openedx|react-paragon-topaz)/)',
],

  coveragePathIgnorePatterns: [
    'src/setupTests.js',
    'src/i18n',
  ],
};