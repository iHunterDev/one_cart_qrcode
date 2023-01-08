<template>
  <div class="qrcode">
    <t-row>
      <t-col span="6">
        <t-table :data="data" :columns="columns" max-height="99vh" size="small" table-layout="auto" bordered
          cell-empty-content="-">
        </t-table>
      </t-col>
      <t-col span="6" class="action-area">
        <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @reset="onReset" @submit="onSubmit">

          <t-form-item label="一拖几" name="goods_num" help="指一个二维码包含几个商品">
            <t-input v-model.number="formData.goods_num" placeholder="请输入一个二维码几个商品"></t-input>
          </t-form-item>

          <t-form-item label="下单件数" name="piece" help="指一件商品购买几件">
            <t-input v-model.number="formData.piece" placeholder="请输入一个商品买几件"></t-input>
          </t-form-item>

          <t-form-item label="拖几轮" name="round" help="要刷给商品刷几次就写几，会随机打算商品顺序重复生成二维码。">
            <t-input v-model.number="formData.round" placeholder="请输入一个二维码几个商品"></t-input>
          </t-form-item>

          <t-form-item label="会员商品ID" name="vip_id" help="给有会员模式的店铺刷会员商品用的，注意这里写的会员ID不能在左侧的商品中出现">
            <t-input v-model.number="formData.vip_id" placeholder="请输入会员商品ID"></t-input>
          </t-form-item>

          <t-form-item>
            <t-space size="small">
              <t-button theme="success" type="button" @click="readGoodsHandle">1. 粘贴商品ID</t-button>
              <t-button theme="primary" type="submit">2. 生成二维码</t-button>
              <!-- <t-button theme="default" variant="base" type="reset">重置</t-button> -->
              <!-- 下方示例代码，有效，勿删 -->
              <!--<t-button theme="default" @click="submitForm">实例方法提交</t-button>-->
              <!--<t-button theme="default" variant="base" @click="resetForm">实例方法重置</t-button>-->
              <!--<t-button theme="default" variant="base" @click="validateOnly">仅校验</t-button>-->
            </t-space>
          </t-form-item>

          <t-form-item>
            <t-space size="small" break-line>
              <t-button theme="default" type="button" @click="clearGoodsHandle">清空商品</t-button>
              <t-button theme="default" type="button" @click="shuffleGoodsHandle">打乱商品</t-button>
              <t-button theme="default" type="button" @click="openQrcodeFolderHandle">打开二维码保存文件夹</t-button>
            </t-space>
          </t-form-item>
        </t-form>



      </t-col>
    </t-row>

  </div>
</template>

<script setup>
import { ref, reactive, watch, toRaw } from 'vue'
import { MessagePlugin, NotifyPlugin, LoadingPlugin } from 'tdesign-vue-next'


const data = reactive([]);

const columns = ref([
  { colKey: 'index', title: '#' },
  { colKey: 'id', title: 'ID' },
  { colKey: 'piece', title: '购买件数' },
])

const verifyVipId = (val) => {
  return new Promise((resolve) => {
    resolve(!isIdRepeat(val))
  })
}
// 表单验证
const FORM_RULES = {
  goods_num: [
    { required: true, message: '一拖几必须填写', type: 'error' },
    { pattern: /^\d+$/, message: '一拖几必须填写整数' },
  ],
  piece: [
    { required: true, message: '下单件数必须填写', type: 'error' },
    { pattern: /^\d+$/, message: '一拖几必须填写整数' },
  ],
  round: [
    { required: true, message: '拖几轮必须填写', type: 'error' },
    { pattern: /^\d+$/, message: '拖几轮必须填写整数' },
  ],
  vip_id: [
    { pattern: /^\d+$/, message: '会员商品ID必须填写整数' },
    { validator: verifyVipId, message: '会员商品已在商品列表中，请删除后再使用该功能' }
  ]
}

// 表单的
const formData = reactive({
  goods_num: 6, // 一个二维码几个商品
  piece: 2, // 一个商品买几件
  round: 1, // 拖几轮
  vip_id: '', // 会员商品id，用来给二维码附加会员商品，刷会员模式
})

// 同步下单件数到表格
watch(() => formData.piece, (value) => {
  data.map(goods => {
    return goods.piece = value
  })
})

/**
 * 对数组进行分组
 * @param {array} array 原数组
 * @param {number} subGroupLength 分组大小
 * @param {callback} callback 数据回调处理
 */
const arrayGroup = (array, subGroupLength, callback) => {
  console.log(array, subGroupLength, callback)
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
 */
const generateBuyLink = (idList) => {
  let paramArray = []

  idList.forEach(id => {
    paramArray.push(`${id}_${formData.piece}_0`)
  })

  return paramArray.join(',')
}

const onReset = () => {
  MessagePlugin.success('重置成功');
}

const onSubmit = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    console.log(toRaw(data))
    LoadingPlugin(true)

    serverApi.batchGenerateQrcode(toRaw(data), formData.goods_num, formData.piece, formData.round, formData.vip_id).then(res => {
      LoadingPlugin(false)
      MessagePlugin.success('二维码生成完毕！')
    })

    // 对数据进行分组
    // let dataGroup = arrayGroup(data, formData.goods_num, function (value) {
    //   return value.id
    // })

    // console.log('dataGroup', dataGroup);
    // const generateQrcodeAction = function(index) {
    //   if (!dataGroup[index]) return

    //   // 生成链接
    //   // https://main.m.taobao.com/order/index.html?buyNow=false&buyParam=694690670762_2_0,692254764019_3_0
    //   // butParam 格式： 商品id_购买件数_SKUID，如果是单一sku则为0
    //   let baseUrl = 'https://main.m.taobao.com/order/index.html?buyNow=false&buyParam='
    //   let buyParam = generateBuyLink(dataGroup[index])
    //   // 加入会员商品id
    //   if (formData.vip_id) {
    //     buyParam = `${formData.vip_id}_1_0,${buyParam}`
    //   }
    //   let fullUrl = baseUrl + buyParam
      
    //   serverApi.generateQrcode(index + 1, fullUrl).then(res => {
    //     console.log(res, 'exec next qrcode', buyParam)
    //     generateQrcodeAction(index + 1)
    //   })
    // }
    // generateQrcodeAction(0)

    
  } else {
    console.log('Validate Errors: ', firstError, validateResult);
    MessagePlugin.warning(firstError);
  }
}

/**
 * 清空商品
 */
const clearGoodsHandle = () => {
  data.splice(0, data.length)
}

/**
 * 判断商品是否重复
 * @param {*} id 商品id
 */
const isIdRepeat = (id) => {
  let index = data.findIndex((goods) => {
    return goods.id == id
  })

  return index == -1 ? false : true
}

/**
 * 插入商品到表格
 * @param {*} id 商品id
 */
const insertOneGoodsData = (id) => {
  if (isIdRepeat(id)) return false
  let index = data.length + 1
  data.push({
    index,
    id,
    piece: formData.piece,
  })
  return true
}

/**
 * 读取商品ID
*/
const readGoodsHandle = () => {
  serverApi.clipboard.readText().then(res => {
    // 处理数据 and 过滤数据
    let goodsList = res.split(/[\r\n]/)
    // 清理多余的内容只提取出数字
    goodsList = goodsList.map((item) => {
      const filter = item.match(/\d+/)
      if (filter) {
        return filter[0]
      }
      return null
    })
    // 清理空内容
    goodsList = goodsList.filter((item) => {
      return item
    })


    let okNum = 0
    let repeatNum = 0

    // const idList = []
    // 校验数据
    // 1. 一种是直接复制的ID
    // 2. 一种是直接复制的商品链接
    const idRegExp = new RegExp(/^\d+$/)
    const linkRegExp = new RegExp(/[&?]id=\d+/)
    goodsList.forEach(goods => {
      if (idRegExp.test(goods)) {
        console.log('粘贴的是id')
        if (insertOneGoodsData(goods)) {
          okNum++
        } else {
          repeatNum++
        }
      } else if (linkRegExp.test(goods)) {
        console.log('粘贴的是链接')
        // 提取ID
        let url = new URL(goods)
        let urlSearchParam = new URLSearchParams(url.search)
        console.log(url, urlSearchParam)
        if (insertOneGoodsData(urlSearchParam.get('id'))) {
          okNum++
        } else {
          repeatNum++
        }
      } else {
        console.log('ID未匹配上：', goods)
      }
    })

    MessagePlugin.success(`已识别到有效商品 ${okNum}，过滤重复商品 ${repeatNum}`);

  }).catch(err => {
    // console.log('err', err)
    NotifyPlugin.warning({ title: '读取剪切板内容失败！', content: err.message, duration: 1000 })
  })
}

// 打乱商品
const shuffleGoodsHandle = () => {
  let tableData  = data.splice(0, data.length)

  tableData.sort(() => {
    return .5 - Math.random()
  })

  tableData.forEach(item => {
    insertOneGoodsData(item.id)
  })
}

// 打开二维码保存文件夹
const openQrcodeFolderHandle = () => {
  serverApi.openQrcodeFolder()
}
</script>

<style lang="less" scoped>
.action-area {
  padding: 16px !important;
}
</style>
