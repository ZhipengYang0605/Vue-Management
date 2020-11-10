import axios from 'axios'

export default function ajax (url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    if (!url.includes('login')) axiosInterceptor()
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
    } else {
      // post请求
      promise = axios.post(url, data)
    }

    // 处理结果
    promise.then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
  })
}

function axiosInterceptor () {
  axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })
}
