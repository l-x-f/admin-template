import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request 拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'JWT ' + getToken()
    }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status !== 1) {
      // status == 0 错误
      var message = res.errMsg
      // errCode: 403, token 过期了
      if (res.errCode === 403) {
        message = '账号信息已经过期，请重新登录'
      } else {
        // 其他提示信息
        Message({
          message: message,
          type: 'error',
          duration: 3 * 1000
        })
      }
      // 删除token，退出用户账号到登录界面
      if (res.errCode === 403) {
        MessageBox.confirm(message, '信息', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(() => {
            // 为了重新实例化vue-router对象 避免bug
            window.location.href = '/login'
          })
        })
      }
      return Promise.reject(res)
    } else {
      return response.data.data
    }
  },
  error => {
    Message({
      message: error.errMsg || '服务器发生错误！',
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
