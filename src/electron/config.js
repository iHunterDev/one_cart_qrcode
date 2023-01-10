const path = require('path')
const os = require('os')


// 二维码保存位置
let qrcodeSavePath = path.resolve(os.homedir(), './Documents/淘宝一键加购二维码')

// 菜单配置
const menu = [
  {
    label: '淘宝一键加购二维码生成助手（单sku版本）',
    submenu: [
      {
        label: '退出',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit'
      }
    ]
  },
  {
    label: '文件',
    submenu: [
      {
        label: '关闭窗口',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll'
      },
    ]
  }
]

module.exports = {
  qrcodeSavePath,
  menu
}