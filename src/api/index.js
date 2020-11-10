import ajax from './ajax'
const baseURL = 'http://127.0.0.1:8888/api/private/v1/'
export const requstLogin = (data) => ajax(baseURL + 'login', data)
export const requstMenu = () => ajax(baseURL + 'menus')
