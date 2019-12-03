import { AxiosRequestConfig } from '../types'
import { isDef } from './helpers/util'

export default function xhr(config: AxiosRequestConfig): void {
  const { url, method = 'get', data = null, params, headers, async = true } = config
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, async)

  Object.keys(headers).forEach((key) => {
    if (!isDef(data) && key.toLowerCase() === 'content-type') {
      delete headers[key]
    } else {
      request.setRequestHeader(key, headers[key])
    }
  })

  request.send(data)
}
