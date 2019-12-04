import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { isDef } from './helpers/util'
import { parseHeaders } from './helpers/header'

export default function request(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve) => {
    const { url, method = 'get', data = null, headers, responseType, async = true } = config
    const xhr = new XMLHttpRequest()

    if (isDef(responseType)) {
      xhr.responseType = responseType!
    }

    xhr.open(method.toUpperCase(), url, async)

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        return
      }

      const responseHeaders = parseHeaders(xhr.getAllResponseHeaders())
      const responseData = (isDef(responseType) && responseType !== 'text')
        ? xhr.response
        : xhr.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        config,
        request: xhr
      }
      resolve(response)
    }

    Object.keys(headers).forEach((key) => {
      if (!isDef(data) && key.toLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        xhr.setRequestHeader(key, headers[key])
      }
    })

    xhr.send(data)
  })
}
