import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

// TODO refactor to import and working whatever current cwd is
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require('./tsconfig.spec.json');
process.env.TZ = 'GMT';
const jestConfig: JestConfigWithTsJest = {
  // to enable logs, comment out the following line
  silent: true,
  // For more information please have a look to official docs https://jestjs.io/docs/configuration/#prettierpath-string
  // Prettier v3 will should be supported in jest v30 https://github.com/jestjs/jest/releases/tag/v30.0.0-alpha.1
  prettierPath: null,
  displayName: 'twenty-front',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['./setupTests.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['../../node_modules/'],
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          experimental: {
            plugins: [['@lingui/swc-plugin', {}]],
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg|svg\\?react)$':
      '<rootDir>/__mocks__/imageMock.js',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
      prefix: '<rootDir>/../../',
    }),
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  coverageThreshold: {
    global: {
      statements: 57,
      lines: 55,
      functions: 47,
    },
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'states/.+State.ts$',
    'states/selectors/*',
    'contexts/.+Context.ts',
    'testing/*',
    'tests/*',
    'config/*',
    'graphql/queries/*',
    'graphql/mutations/*',
    'graphql/fragments/*',
    'types/*',
    'constants/*',
    'generated-metadata/*',
    'generated/*',
    '__stories__/*',
    'display/icon/index.ts',
  ],
  coverageDirectory: './coverage',
};

export default jestConfig;
