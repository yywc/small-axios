import { deepMerge, isDef, isObject } from './util'
import { Method } from '../types'

function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!isDef(headers)) {
    return
  }
  Object.keys(headers).forEach(key => {
    const isNotEqualFully =
      key !== normalizeName && key.toUpperCase() === normalizeName.toUpperCase()
    if (isNotEqualFully) {
      headers[normalizeName] = headers[key]
      delete headers[key]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  const needSetDefaultHeaders = isObject(data) && headers && !headers['Content-Type']
  if (needSetDefaultHeaders) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!isDef(headers)) {
    return parsed
  }

  headers.split(/\r\n/).forEach(header => {
    let [key, ...value] = header.split(':')
    key = key.trim().toLowerCase()
    if (isDef(key)) {
      parsed[key] = value.join(':').trim()
    }
  })

  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!isDef(headers)) {
    return headers
  }

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
