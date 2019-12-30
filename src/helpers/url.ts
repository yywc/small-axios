import { isDate, isObject, isDef, isArray, isURLSearchParams } from './util'

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

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!isDef(params)) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      let value = params[key]
      if (!isDef(value)) {
        return
      }
      // 格式化 key、value
      ;[value, key] = formatValue(value, key)
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
    serializedParams = parts.join('&')
  }
  // 组合参数
  if (isDef(serializedParams)) {
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

interface URLOrigin {
  protocol: string
  host: string
}

const urlParseNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParseNode.setAttribute('href', url)
  const { protocol, host } = urlParseNode
  return {
    protocol,
    host
  }
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d+-.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
