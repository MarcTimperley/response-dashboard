module.exports = {
  'extends': ['standard'],
  rules: {
    'space-before-function-paren': ['error', 'never'],
    'no-labels': ['error', {
      'allowLoop': true
    }]
  },
  'plugins': [],
  'env': {
    'browser': true,
    'node': true,
    'jquery': true,
    'jest': true
  }
}
