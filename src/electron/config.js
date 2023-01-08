const path = require('path')
const os = require('os')


// 二维码保存位置
let qrcodeSavePath = path.resolve(os.homedir(), './Documents/淘宝一键加购二维码')

module.exports = {
  qrcodeSavePath,
}