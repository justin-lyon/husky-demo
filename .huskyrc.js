const tasks = arr => arr.join(' && ')

module.exports = {
  hooks: {
    'pre-commit': tasks([
      'npx detect-secrets-launcher'
    ])
  }
}