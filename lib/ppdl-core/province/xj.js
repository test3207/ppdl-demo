const puppeter = require('puppeteer')
const path = require('path')
const oss = require(path.join(process.cwd(), 'lib/oss'))

module.exports = async (options = {}) => {
  const serialNo = options.serialNo || ''
  const payeeName = options.payeeName || ''
  const browser = await puppeter.launch({
    headless: !!options.headless,
    defaultViewport: {
      width: 1366,
      height: 768
    }
  })
  let flag
  const page = (await browser.pages())[0]
  page.on('error', (e) => {
    // console.log(e)
  }).on('load', async () => {
    await page.screenshot({
      path: path.join(process.cwd(), `./temp/${serialNo}.png`),
      clip: {
        x: 318,
        y: 165,
        width: 713,
        height: 450
      }
    })
    await oss.put(options)
    await browser.close()
  })
  await page.goto(`http://finpt.xjcz.gov.cn/finpt/billCheck/print.do?billNo=${serialNo}&payeeName=${encodeURI(payeeName)}`)
}
