module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'airbnb'
  ],
  globals: {
    window: true,
    React: true,
    google: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true
  },
  // parser: 'babel-eslint',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      webpack: {
        config: 'src/config/webpack/webpack.common.js'
      }
    }
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'react/destructuring-assignment': 0,
    'react/prop-types': 0,
    'import/no-extraneous-dependencies': 0,
    'react/jsx-one-expression-per-line': 0,
    'no-underscore-dangle': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/prefer-stateless-function': 1,
    'react/sort-comp': 0,
    'no-plusplus': 0,
    'react/forbid-prop-types': 0,
    'no-param-reassign': 0,
    'no-console': 0,
    'no-alert': 0,
    'no-prompt': 0,
    'jsx-a11y/label-has-associated-control': 0,
    '@typescript-eslint/no-undef': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-use-before-define': 'off',
    // '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-empty-function': 0,
    'no-unused-vars': 0,
    'no-restricted-imports': [
      'error',
      { patterns: ['@material-ui/*/*/*', '!@material-ui/core/test-utils/*'] }
    ],
    'react/jsx-props-no-spreading': 0,
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
    'import/no-named-as-default': 0,
    '@typescript-eslint/naming-convention': 0
  }
};
