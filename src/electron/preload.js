const { contextBridge, ipcRenderer } = require('electron')
const os = require('os')
contextBridge.exposeInMainWorld('serverApi', {
  // node: () => process.versions.node,
  // chrome: () => process.versions.chrome,
  // electron: () => process.versions.electron,
  // 能暴露的不仅仅是函数，我们还可以暴露变量

  // 服务端操作
  generateQrcode: (index, data, fileprefix='qrcode') => ipcRenderer.invoke('generateQrcode', index, data, fileprefix),
  batchGenerateQrcode: (data, goods_num, piece, round, vip_id) => ipcRenderer.invoke('batchGenerateQrcode', data, goods_num, piece, round, vip_id),

  // 剪切板读取
  clipboard: {
    readText: () => ipcRenderer.invoke('clipboard_readText')
  },
  
  // 打开二维码文件夹
  openQrcodeFolder: () => ipcRenderer.invoke('openQrcodeFolder')
})