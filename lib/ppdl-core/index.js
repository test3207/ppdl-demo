const jx = require('./province/jx')
const gd = require('./province/gd')
const zj = require('./province/zj')

module.exports = {
  jx: async (options) => {
    await jx(options)
  },
  gd: async (options) => {
    await gd(options)
  },
  zj: async (options) => {
    await zj(options)
  }
}
