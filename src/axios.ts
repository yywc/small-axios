import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/CancelToken'
import mergeConfig from './core/mergeConfig'

function createAxios(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)

  // 这样可以使得 axios 既可以用 Axios 里的方法，同时自身也可以调用
  // 相当于调用了 Axios.request 方法，且会绑定 this 到 context 实例上
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createAxios(defaults)

axios.create = function create(config) {
  return createAxios(mergeConfig(defaults, config))
}

axios.isCancel = isCancel
axios.Cancel = Cancel
axios.CancelToken = CancelToken

export default axios
