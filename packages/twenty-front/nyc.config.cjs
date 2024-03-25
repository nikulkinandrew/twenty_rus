const globalCoverage = {
  statements: 60,
  lines: 60,
  functions: 60,
  exclude: ['src/generated/**/*'],
};

const modulesCoverage = {
  statements: 80,
  lines: 80,
  functions: 80,
  include: ['src/modules/**/*'],
  exclude: ['src/**/*.ts'],
};

const pagesCoverage = {
  statements: 60,
  lines: 60,
  functions: 45,
  exclude: ['src/generated/**/*', 'src/modules/**/*', 'src/**/*.ts'],
};

const storybookStoriesFolders = process.env.STORYBOOK_SCOPE;

module.exports =
  storybookStoriesFolders === 'pages'
    ? pagesCoverage
    : storybookStoriesFolders === 'modules'
      ? modulesCoverage
      : globalCoverage;
