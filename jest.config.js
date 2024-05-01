module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/dist/test'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
};
