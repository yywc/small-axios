import { isDate, isObject, isEmpty, isArray } from './util'

function encode(val: string): string {
  return encodeURI(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

function formatValue(value: any, key: string): [any[], string] {
  let values: string[]
  if (isArray(value)) {
    values = value
    key += '[]'
  } else {
    values = [value]
  }
  return [values, key]
}

export default function buildURL(url: string, params?: any): string {
  if (isEmpty(params)) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach((key) => {
    let value = params[key]
    if (isEmpty(value)) {
      return
    }
    // 格式化 key、value
    [value, key] = formatValue(value, key)
    value.forEach((val: any) => {
      // 日期、对象特殊处理
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  // 组合参数
  const serializedParams = parts.join('&')
  if (!isEmpty(serializedParams)) {
    // 去除 hash 部分
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex)
    }
    // 判断 url 是否带参数
    url += (url.indexOf('?') !== -1 ? '&' : '?') + serializedParams
  }
  return url
}
