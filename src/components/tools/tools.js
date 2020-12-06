// 格式化时间
// date为毫秒
// 输出格式 2020/01/01 01:01:01
export function formateDate (date) {
  const d = new Date(date)
  function addZero (num) {
    if (num < 10) {
      return '0' + num
    }
    return num
  }
  return d.getFullYear() + '/' + addZero(d.getMonth() + 1) + '/' + addZero(d.getDate()) + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds())
}
