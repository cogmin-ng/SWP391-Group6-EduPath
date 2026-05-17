module.exports = {
  env: { node: true, es2022: true, jest: true },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: { ecmaVersion: 2022 },
  rules: { 'no-console': 'off' },
};
