import { AxiosRequestConfig } from '../types'

export default function xhr(config: AxiosRequestConfig): void {
  const { url, method = 'get', data, params, async = true } = config
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, async)
  request.send(data)
}
