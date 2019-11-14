// 这一层只做识别器，输入图片位置，输出code；读不出来不应该抛出错误，直接给标识即可，以免上层容错过于复杂

/**
 * mode取值与代表的意思：
 * 1：4位纯数字，
 * 2：4位数字字母混合
 */
const methods = {
  tesseract: require('./tesseract.js'),
  fateadm: require('./fateadm.js')
}
/**
 * @param options Optional Object
 * @param options.type Optional String IN ['tesseract'(default), 'fateadm']
 * @param options.input Optional String './temp/input.jpeg'(default) Highly Recommended Set Yourself
 * @param options.output Optional String './temp/output'(default) Set an unique route if there is a need of multi call
 * @param options.mode Optional Number 0(default) 
 */
module.exports = async (options = {}) => {
  if (!options.type) options.type = 'tesseract'

  let code
  try {
    code = await methods[options.type](options)
  } catch (e) {}
  return code
}
