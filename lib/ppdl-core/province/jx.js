const puppeter = require('puppeteer')
const fs = require('fs')
const path = require('path')
const recognizer = require(path.join(process.cwd(), 'lib/recognizer'))
const oss = require(path.join(process.cwd(), 'lib/oss'))

module.exports = async (options = {}) => {
  const { serialNo = '', headless = false } = options
  const input = `./temp/${serialNo}input/jpeg`
  const browser = await puppeter.launch({
    headless: headless
  })
  const page = (await browser.pages())[0]
  page.on('response', async (Response) => {
    if (Response.url().includes('chkcodeByweb.jsp')) {
      try {
        const picStr = await Response.buffer()
        fs.writeFileSync(path.join(process.cwd(), input), picStr)
        const code = await recognizer({
          ...options,
          input
        })
        await page.type('#bizCode_ipt', serialNo, {})
        await page.type('#code', code, {})
        await page.click('.a-button4')
      } catch (e) { console.log(e) }
    }
  }).on('error', (e) => {
    // console.log(e)
  }).on('dialog', () => {
    console.log('fail')
    setTimeout(() => {
      browser.close()
      return false
    }, 1000)
  }).on('load', async () => {
    if (page.url().includes('http://fszfpt.jxf.gov.cn:7018/bcweb/page/billcheck/bills.html')) {
      const element = await page.$('img')
      const data = (await (await element.getProperty('src')).jsonValue()).replace(/^data:image\/\w+;base64,/, "")
      const buffer = Buffer.from(data, 'base64')
      fs.writeFileSync(path.join(process.cwd(), `./temp/${serialNo}.png`), buffer)    
      await oss.put(options)
      await browser.close()
    }
  })
  await page.goto('http://fszfpt.jxf.gov.cn:7018/bcweb/page/front/bill_check.jsp')
  await page.click('#bizCodeText')
}
