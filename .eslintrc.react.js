module.exports = {
  extends: [
    'plugin:@nx/react',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  plugins: ['react-hooks', 'react-refresh'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.base.{json,*.json}'],
      },
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@tabler/icons-react'],
                message: 'Please import icons from `twenty-ui`',
              },
              {
                group: ['react-hotkeys-web-hook'],
                importNames: ['useHotkeys'],
                message:
                  'Please use the custom wrapper: `useScopedHotkeys` from `twenty-ui`',
              },
            ],
          },
        ],
        '@nx/workspace-effect-components': 'error',
        '@nx/workspace-no-hardcoded-colors': 'error',
        '@nx/workspace-matching-state-variable': 'error',
        '@nx/workspace-sort-css-properties-alphabetically': 'error',
        '@nx/workspace-styled-components-prefixed-with-styled': 'error',
        '@nx/workspace-no-state-useref': 'error',
        '@nx/workspace-component-props-naming': 'error',
        '@nx/workspace-explicit-boolean-predicates-in-if': 'error',
        '@nx/workspace-use-getLoadable-and-getValue-to-get-atoms': 'error',
        '@nx/workspace-useRecoilCallback-has-dependency-array': 'error',
        'react/no-unescaped-entities': 'off',
        'react/prop-types': 'off',
        'react/jsx-key': 'off',
        'react/display-name': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-no-useless-fragment': 'off',
        'react/jsx-props-no-spreading': [
          'error',
          {
            explicitSpread: 'ignore',
          },
        ],
        'react-hooks/exhaustive-deps': [
          'warn',
          {
            additionalHooks: 'useRecoilCallback',
          },
        ],
      },
    },
  ],
};
