const { env = 'dev'} = process.NODE_ENV || {}
const defaultConfig = require('./default.js')
let envConfig = {}
try {
  envConfig = require(`./${env}.js`)
} catch (e) {}
module.exports = {
  ...defaultConfig,
  ...envConfig
}
