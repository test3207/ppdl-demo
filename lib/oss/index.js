const path = require('path')
const { ossConfig } = require(path.join(process.cwd(), 'config'))
const OSS = require('ali-oss')
const client = new OSS(ossConfig)

module.exports = {
  put: async (options) => {
    const { serialNo } = options
    await client.put(`processBill/${serialNo}.png`, path.join(process.cwd(), `./temp/${serialNo}.png`))
  }
}
