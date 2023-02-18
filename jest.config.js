const { pathsToModuleNameMapper } = require('ts-jest');
const compilerOptions = {
  paths: {
    '@/*': ['./*'],
    '@public/*': ['public/*'],
    '@src/*': ['src/*'],
    '@config': ['src/config/index.ts'],
    '@config/*': ['src/config/*'],
    '@controllers': ['src/controllers/index.ts'],
    '@controllers/*': ['src/controllers/*'],
    '@middleware': ['src/middleware/index.ts'],
    '@middleware/*': ['src/middleware/*'],
    '@models': ['src/models/index.ts'],
    '@models/*': ['src/models/*'],
    '@routes': ['src/routes/index.ts'],
    '@routes/*': ['src/routes/*'],
    '@utils': ['src/utils/index.ts'],
    '@utils/*': ['src/utils/*'],
  },
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
