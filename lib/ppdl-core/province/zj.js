const puppeter = require('puppeteer')
const path = require('path')
const oss = require(path.join(process.cwd(), 'lib/oss'))

module.exports = async (options = {}) => {
  const serialNo = options.serialNo || ''
  const code = options.code || ''
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
    if (!flag) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000);
      })
      await page.type('#certificateNo', serialNo, {})
      await page.type('#certificate_jym', code, {})
      await page.click('#submitCertificateBtn')
      flag = true
    } else {
      await page.screenshot({
        path: path.join(process.cwd(), `./temp/${serialNo}.png`),
        clip: {
          x: 326,
          y: 0,
          width: 716,
          height: 458
        }
      })
      await oss.put(options)
      await browser.close()
    }
  })
  await page.goto('http://pay.zjzwfw.gov.cn/searchCertificate.htm')
}
