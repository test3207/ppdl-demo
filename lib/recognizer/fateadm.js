const fs =require('fs')
const md5 = require('md5')
const path = require('path')
const req = require('superagent')
const fateadmConfig = require(path.join(process.cwd(), 'config')).fateadmConfig
const { user_id, app_id, user_key, app_key } = fateadmConfig

module.exports = async (options) => {
  const { input = './temp/input.jpeg', mode = 2 } = options
  const img_data = fs.readFileSync(path.join(process.cwd(), input)).toString('base64')
  const apiOptions = {
    user_id: user_id,
    timestamp: String(parseInt(new Date() / 1000)),
    app_id: app_id,
  }
  if (mode === 2) {
    apiOptions.predict_type = '30400'
  }
  apiOptions.sign = md5(apiOptions.user_id + apiOptions.timestamp + md5(apiOptions.timestamp + user_key))
  apiOptions.asign = md5(apiOptions.app_id + apiOptions.timestamp + md5(apiOptions.timestamp + app_key))

  const resStr = await req.post('http://pred.fateadm.com/api/capreg').set('Content-Type', 'application/x-www-form-urlencoded').send({
    ...apiOptions,
    img_data
  })
  let resObj, code
  try {
    resObj = JSON.parse(resStr.text)
    code = JSON.parse(resObj.RspData).result
  } catch (e) {}
  return code
}
