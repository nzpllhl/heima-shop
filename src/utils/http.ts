/*
* 添加拦截器：
  拦截request请求
  拦截 uploadFile 文件上传
  TODO:
  1. 非 http 开头需要拼接地址
  2. 请求超时
  3. 添加下程序端请求标识
  4. 添加token请求头标识
*/
import { useMemberStore } from '@/stores'
// 服务器基础地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
// 添加拦截器
const httInterceptor = {
  // 拦截前触发需要写在invoke函数里面
  invoke(options: UniApp.RequestOptions) {
    // 1.拼接完整地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2.请求超时,默认60
    options.timeout = 1000
    console.log('options', options)
    //3. 添加下程序端请求标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp'
    }
    // 4. 添加token
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  }
}
uni.addInterceptor('request', httInterceptor)
uni.addInterceptor('uploadFile', httInterceptor)
/*
请求返回函数的封装
@paeam UniApp.RequestOptions
@returns Promise
1.返回Promise 对象
2.请求成功
  2.1 提取核心数据
  2.2 添加类型，支持泛型
3. 请求失败
  3.1 网络错误-> 提示用户换网络
  3.2 401 错误 -> 清理用户信息，跳转到登录页
  3.3 其他错误 -> 根据后端错误轻提示
*/

// 指定返回的数据类型
interface Date<T> {
  code: string,
  msg: string,
  result: T
}
// 2.2 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1. 返回一个promise
  return new Promise<Date<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 2.请求成功,转态码 2XX axios 就是这样设置的
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 提取核心数据
          resolve(res.data as Date<T>)
        } else if (res.statusCode === 401) {
          // 401 错误 -》 清理用户信息跳转到登录页
          const memberStore = useMemberStore()
          uni.navigateTo({
            url: "/pages/login/login"
          })
          reject(res)
        } else {
          // 3.3 其他错误 -> 根据后端错误轻提示
          // 3.4 res.data as Date<T>  把返回的res as断言为更加准确的类型
          uni.showToast({
            icon: 'none',
            title: (res.data as Date<T>).msg || '请求错误！'
          })
        }
        reject(res)
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试！'
        })
        reject(err)
      }
    })
  })
}
