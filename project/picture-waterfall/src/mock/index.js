const Mock = require('mockjs')
const { picList } = require('./data/picList.json')
Mock.mock(RegExp(/\/api\/getPicList/), 'get', ({ url }) => {
  const { index = 0, count = 6 } = getQuery(url)
  return picList.slice(~~index, ~~index + ~~count)
})
function getQuery(url, name) {
  let res = {}
  let index = url.indexOf('?')
  //是否存在参数
  if (index === -1) {
    return undefined
  }
  //按照&分割参数
  let paramsArr = url.substring(index + 1).split('&')
  console.log(paramsArr) // ["type=blog", "name=kaimo"]
  // 遍历 paramsArr
  for (let i = 0; i < paramsArr.length; i++) {
    // 每个元素用 = 分割
    let paramsItem = paramsArr[i].split('=')
    res[paramsItem[0]] = paramsItem[1]
  }
  return name ? res[name] : res
}
// Mock.mock('/api/sendPicList', 'post', ({ url, body }) => {
//   const data = JSON.parse(body)
//   readFile(filePath, 'utf-8', (err, data) => {
//     if (err) throw err
//     // let res = JSON.parse(data)
//     // // 需要得到id，id为数组中最后一个图书的id+1
//     // let index = res[res.length - 1].id + 1
//     // // 向obj对象中添加id属性
//     // obj.id = index
//     // res.push(obj)
//     // 写入到json文件中 --> 需要把res转为字符串写入到json文件
//     writeFile(filePath, data, (err) => {
//       if (err) throw err
//       console.log('添加成功')
//     })
//   })
// })
