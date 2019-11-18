const ppdlCore = require('./lib/ppdl-core')
const args = process.argv
const provinces = ['jx', 'zj', 'gd', 'xj']
let province = 'jx'
for (let i = 0 ; i < args.length ; i++) {
  if (args[i] === '-p') {
    args[i+1] && (province = args[i+1])
  } 
}

if (!provinces.includes(province)) throw new Error('You Have But These Provinces To Choose: jx, zj, gd, xj')

ppdlCore[province]({
  serialNo: '123',
  type: 'fateadm', // 识别器，有验证码的省份需要填
  payeeName: '张三', // 付款人，新j需要填
  checkCode: '7777' // 校验码，浙江需要填
})
