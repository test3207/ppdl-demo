const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const modes = {
  1: '--psm 6 digits',
  2: '--psm 13'
}

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const { input = './temp/input.jpeg', output = './temp/output.txt', min = false, mode = 1 } = options

    if (!fs.existsSync(path.join(process.cwd(), './temp'))) fs.mkdirSync(path.join(process.cwd(), './temp'))
    if (!fs.existsSync(path.join(process.cwd(), input))) reject('cannot read file')

    exec(`tesseract ${path.join(process.cwd(), input)} ${path.join(process.cwd(), output).slice(0, -4)} ${modes[mode]}`, async () => {
      const codeRaw = fs.readFileSync(path.join(process.cwd(), output)).toString('utf8')
        .replace('O', 0).replace('G', 6).replace('i', 1).replace('l', 1).replace('I', 1)
      if (min) fs.rmdirSync(path.join(process.cwd(), input)) && fs.rmdirSync(path.join(process.cwd(), output))
      let code = ''
      
      if (mode === 1) {
        for (const char of codeRaw) {
          if ('0123456789'.includes(char)) code += char
          if (code.length === 4) {
            resolve(code)
            return
          }
        }
      } else if (mode === 2) {
        for (const char of codeRaw) {
          if (char.match(/\w/)) code += char
          if (code.length === 4) {
            resolve(code)
            return
          }
        }
      }
      reject()
    })
  })
}
