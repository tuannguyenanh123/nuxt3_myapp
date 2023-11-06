module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest'
  },
  extends: ['@nuxt/eslint-config', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    '@typescript-eslint/no-unused-vars': ['error'],
    'vue/v-on-style': ['error', 'longform'],
    'vue/v-bind-style': ['error', 'longform']
  }
}
