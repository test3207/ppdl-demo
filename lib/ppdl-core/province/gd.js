const puppeter = require('puppeteer')
const fs = require('fs')
const path = require('path')
const recognizer = require(path.join(process.cwd(), 'lib/recognizer'))
// const recognizer = require('../../recognizer')
const oss = require(path.join(process.cwd(), 'lib/oss'))

module.exports = async (options = {}) => {
  const { serialNo = '', headless = false, mode = 2 } = options
  const input = `./temp/${serialNo}input.jpeg`

  const browser = await puppeter.launch({
    headless: headless,
    defaultViewport: {
      width: 1366,
      height: 768
    }
  })
  const page = (await browser.pages())[0]
  let code, pageChanged
  page.on('response', async (Response) => {
    if (Response.url().includes('createCode.do') && pageChanged) {
      try {
        const picStr = await Response.buffer()
        fs.writeFileSync(path.join(process.cwd(), input), picStr)
        code = await recognizer({
          ...options,
          mode,
          input
        })
      } catch (e) { console.log(e) }
      try {
        await page.type('input[name="queryValue"]', serialNo, {})
        await page.type('input[name="codeReq3"]', code, {})
        await page.click('#btnshow2')
      } catch (e) {}
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
      const tdElements = await page.$$('td')
      let targetEl
      for (let i = 0 ; i < tdElements.length ; i++) {
        const tdElement = tdElements[i]
        const value = await page.evaluate(el => el.innerHTML, tdElement)
        if (value === '支付成功') {
          targetEl = tdElements[i-8]
          break
        }
      }
      if (!targetEl) return false
      await targetEl.click()
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
      await page.screenshot({
        path: path.join(process.cwd(), `./temp/${serialNo}.png`),
        clip: {
          x: 82,
          y: 88,
          width: 1202,
          height: 608
        }
      })
      await oss.put(options)
      await browser.close()
    }
  }).on('error', (e) => {
    // console.log(e)
  }).on('load', async () => {
  })
  await page.goto('http://wsjf.gdgpo.gov.cn/GdOnlinePay/')
  await page.click('div[data="2"]')
  pageChanged = true
}
