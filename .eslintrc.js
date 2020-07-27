module.exports = {

  env: {

    browser: true,

    es6: true,

  },

  extends: [

    'plugin:react/recommended',

    'airbnb',

  ],

  globals: {

    Atomics: 'readonly',

    SharedArrayBuffer: 'readonly',

  },

  parserOptions: {

    ecmaFeatures: {

      jsx: true,

    },

    ecmaVersion: 2018,

    sourceType: 'module',

  },

  plugins: [

    'react',

  ],

  rules: {

    semi: [2, 'always'],

    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],

    'jsx-a11y/anchor-is-valid': ['error', {

      components: ['Link'],

      specialLink: ['to'],

    }],

    'no-underscore-dangle': 0,

    'react/sort-comp': 0,

    'linebreak-style': ['error', 'windows'],

    'import/no-unresolved': [

      2,

      { caseSensitive: false },

    ],

  },

  parser: 'babel-eslint',

};
