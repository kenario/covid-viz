module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': import.meta.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': import.meta.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-expressions': 'off',
    'operator-linebreak': 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
