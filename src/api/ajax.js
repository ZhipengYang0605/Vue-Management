import axios from 'axios'

export default function ajax (url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    // get请求
    if (type === 'GET') {
      let dataParams = ''
      Object.keys(data).forEach(v => {
        dataParams += v + '=' + data[v] + '&'
      })
      if (dataParams) {
        dataParams = dataParams.substring(0, dataParams.lastIndexOf('&'))
        url = url + '?' + dataParams
      }
      promise = axios.get(url)
    }
    // post请求
    promise = axios.post(url, data)

    // 处理结果
    promise.then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
  })
}
