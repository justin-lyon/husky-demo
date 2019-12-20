const tasks = arr => arr.join(' && ')

module.exports = {
  hooks: {
    // 'pre-commit': tasks([
    //   'echo \" this should fail\" && exit 1 | cat > logs/husky.log'
    // ])
  }
}