import { AxiosRequestConfig } from '../types'
import { deepMerge, isDef, isObject } from '../helpers/util'

const strategy = Object.create(null)

// 普通合并策略
function defaultMerge(t: any, s: any): any {
  return s !== undefined ? s : t
}

strategy._default = defaultMerge

// 只接受传参的合并策略：url、data、params
function specialMerge(t: any, s: any): any {
  if (s !== undefined) {
    return s
  }
}

;['url', 'data', 'params'].forEach(key => {
  strategy[key] = specialMerge
})

// 合并对象
function objectMerge(t: any, s: any): any {
  if (isObject(s)) {
    return deepMerge(t, s)
  } else if (s !== undefined) {
    return s
  } else if (isObject(t)) {
    return deepMerge(t)
  } else if (t !== undefined) {
    return t
  }
}

;['headers'].forEach(key => {
  strategy[key] = objectMerge
})

export default function mergeConfig(
  target: AxiosRequestConfig,
  source?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!isDef(source)) {
    source = {}
  }

  const config = Object.create(null)

  const merge = function(key: string): void {
    const mergeFn = strategy[key] || strategy._default
    config[key] = mergeFn(target[key], source![key])
  }

  // 合并所有自定义配置项
  for (const key in source) {
    merge(key)
  }

  // 如果默认项中存在自定义配置项中没有的，则合并这一部分
  for (const key in target) {
    if (!source![key]) {
      merge(key)
    }
  }

  return config
}
