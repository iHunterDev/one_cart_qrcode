const { clipboard, shell } = require('electron')
const fs = require('fs')
const QRCode = require('qrcode')
const uniqueFilename = require('unique-filename')
const { qrcodeSavePath } = require('./config')

/**
 * 获取剪切板内容为文字
 * @returns 剪切板文字
 */
async function clipboard_readText() {
  return clipboard.readText()
}


async function generateQrcode(event, index, data, fileprefix='qrcode') {
  // 创建二维码存放目录
  if (!fs.existsSync(qrcodeSavePath)) {
    fs.mkdirSync(qrcodeSavePath)
  }

  // 生成二维码
  let qrcodeImgBase64 = await QRCode.toDataURL(data)
  let qrcodeImgBinary = Buffer.from(qrcodeImgBase64.split(',')[1], 'base64')

  // 保存二维码
  const qrcodeFilename = uniqueFilename(qrcodeSavePath, fileprefix + index) + '.png'
  fs.writeFileSync(qrcodeFilename, qrcodeImgBinary)

  // 返回成功
  return true
}


async function batchGenerateQrcode (event, data, goods_num, piece, round, vip_id) {
  for (let r = 1; r <= round; r++) {
    if (r > 1) data = shuffleArray(data)
    console.log(data)    
    let groupData = arrayGroup(data, goods_num)

    for (let i = 0; i < groupData.length; i++) {
      let link = generateBuyLink(groupData[i], [vip_id])

      // index+1 是为了给二维码加一个数字编号
      await generateQrcode(null, i+1, link, `qrcode-round${r}-`)
    }
  }
  
  return true
}

async function openQrcodeFolder() {
  shell.showItemInFolder(qrcodeSavePath)
  return true
}

//+-----------------------------
//| 辅助函数
//+-----------------------------

/**
 * 对数组进行分组
 * @param {array} array 原数组
 * @param {number} subGroupLength 分组大小
 * @param {callback} callback 数据回调处理
 */
function arrayGroup(array, subGroupLength, callback) {
  let index = 0;
  let newArray = [];

  while (index < array.length) {
    if (callback) {
      let newData = []
      let tmpArray = array.slice(index, index += subGroupLength)
      tmpArray.forEach(item => {
        newData.push(callback(item))
      })
      newArray.push(newData)
    } else {
      newArray.push(array.slice(index, index += subGroupLength))
    }
  }

  return newArray;
}


/**
 * 生成加购链接
 * @param {array} idList 商品ID列表
 * @param {array} withIdList 附加上的商品ID列表
 */
function generateBuyLink(idList, withIdList=[]) {
  let paramArray = []

  // 附加的商品列表
  if (withIdList.length && withIdList[0]) {
    withIdList.forEach(item => {
      if (isNaN(parseInt(item))) {
        paramArray.push(`${item.id}_${item.piece}_0`)
      } else {
        paramArray.push(`${item}_1_0`)
      }
    })
  }


  // 商品ID列表
  idList.forEach(item => {
    paramArray.push(`${item.id}_${item.piece}_0`)
  })

  let baseUrl = 'https://main.m.taobao.com/order/index.html?buyNow=false&buyParam='
  return baseUrl + paramArray.join(',')
}


/**
 * 打乱商品
 * @param {array} data 数组
 * @returns 
 */
function shuffleArray(data) {
  data.sort(() => {
    return .5 - Math.random()
  })

  return data
}

module.exports = {
  clipboard_readText,
  generateQrcode,
  batchGenerateQrcode,
  openQrcodeFolder,
}