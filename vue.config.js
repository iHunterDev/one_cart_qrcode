module.exports = {
  pluginOptions:{
    electronBuilder:{
      preload: 'src/electron/preload.js',
      builderOptions: {
        appId: "com.electron.one_cart_qrcode",
        productName: "淘宝一键加购二维码生成助手（单sku版本）",
        copyright: "Copyright © 2022-2023 ${author}",
        win: {
          target: [
            {
              "target": "portable",//利用nsis制作安装程序
              "arch": [
                  "x64",//64位
              ]
            }
          ]
        }
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "淘宝一键加购二维码生成助手（单sku版本）";
        return args
    })
  }
}
