import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import { isDef } from './helpers/util'
import { parseHeaders } from './helpers/header'
import { createError } from './helpers/error'

export default function request(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      async = true
    } = config
    const xhr = new XMLHttpRequest()

    if (isDef(responseType)) {
      xhr.responseType = responseType!
    }

    if (isDef(timeout)) {
      xhr.timeout = timeout!
    }

    xhr.open(method.toUpperCase(), url!, async)

    xhr.onerror = function() {
      reject(createError(
        'Network Error',
        config,
        null,
        request
      ))
    }

    xhr.ontimeout = function() {
      reject(createError(
        `Timeout of ${timeout} ms exceeded`,
        config,
        'ECONNABORTED',
        request
      ))
    }

    xhr.onreadystatechange = function() {
      const isNotSuccess = xhr.readyState !== XMLHttpRequest.DONE
        || xhr.status === 0

      if (isNotSuccess) {
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

      const handleResponse = function(response: AxiosResponse) {
        if (response.status >= 200 && response.status < 300) {
          resolve(response)
        } else {
          reject(createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          ))
        }
      }

      handleResponse(response)
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
