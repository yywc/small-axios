import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'

function createAxios(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)

  // 这样可以使得 axios 既可以用 Axios 里的方法，同时自身也可以调用
  // 相当于调用了 Axios.request 方法，且会绑定 this 到 context 实例上
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosInstance
}

export default createAxios(defaults)
