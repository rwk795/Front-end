module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['vue', 'prettier'],
  rules: {
    // camelcase: 2,
    // curly: 2,
    // 'brace-style': [2, '1tbs'],
    // quotes: [2, 'single'],
    // semi: [2, 'always'],
    // 'space-in-brackets': [2, 'never'],
    // 'space-infix-ops': 2,
  },
}
