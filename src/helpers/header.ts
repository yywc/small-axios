import { isDef, isObject } from './util'

function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!isDef(headers)) {
    return
  }
  Object.keys(headers).forEach((key) => {
    const isNotEqualFully = key !== normalizeName
      && key.toUpperCase() === normalizeName.toUpperCase()
    if (isNotEqualFully) {
      headers[normalizeName] = headers[key]
      delete headers[key]
    }
  })
}

export default function processHeader(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  const needSetDefaultHeaders = isObject(data)
    && (headers && !headers['Content-Type'])
  if (needSetDefaultHeaders) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  return headers
}
