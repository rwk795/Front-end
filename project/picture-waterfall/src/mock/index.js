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
// Mock.mock('/api/test2', 'post', require('./data/test2.json'))
