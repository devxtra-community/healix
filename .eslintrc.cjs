module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
  ecmaVersion: 2022,
  sourceType: 'module',
  project: [
    './frontend/web/tsconfig.json',
    './gateway/tsconfig.json',
    './services/user-service/tsconfig.json',
    './services/admin-service/tsconfig.json'
  ],
  tsconfigRootDir: __dirname
},

  env: {
    node: true,
    browser: true,
    es2022: true
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error'
  },
  ignorePatterns: ['node_modules/', 'dist/', '.next/']
};
