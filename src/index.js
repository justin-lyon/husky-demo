const { spawn } = require('child_process')
const path = require('path')
const rules = require('./regex')

process.setMaxListeners(Infinity)
console.log('max listeners', process.getMaxListeners())

const options = {
  cwd: path.join(__dirname, '..'),
  env: process.env,
  shell: true
}

console.log('dirname', __dirname)
console.log('options.cwd', options.cwd)

const diffArgs = [ 'diff', '--staged', '--name-only' ]
const grepArgs = ['-Enr' ]
const grepArguments = rules.map(p => {
  return ['-Enr', p.pattern]
})

const diff = spawn('git', diffArgs, options)

const burpStream = stream => {
  return new Promise((resolve, reject) => {
    const buffer = []
    stream
      .on('data', data => {
        buffer.push(data)
      })
      .on('end', () => {
        resolve(buffer.join('').toString().trim())
      })
      .on('error', err => {
        reject(err)
      })
  })
}

const searcher = filePaths => {
  return Promise.all(rules.map(r => {
    const grep = spawn('grep', ['-Enr', r.pattern, filePaths], options)
    grep.stdout.pipe(process.stdout)
    return burpStream(grep.stdout)
  }))
}

burpStream(diff.stdout)
  .then(output => {
    const filePaths = output.split('\n')
    console.log('filePaths', filePaths)
    searcher(filePaths.join(' '))
      .then(data => {
        console.log('search results', data.filter(d => d !== ''))
        const results = data.filter(d => d !== '')
        if (results.length > 0) process.exit(1)
      })
  })
  .catch(err => {
    console.error('error', err.message)
  })