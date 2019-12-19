import { AxiosRequestConfig } from './types'
import { processHeader } from './helpers/header'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [
    function(data: any, headers?: any): any {
      processHeader(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

const methodsNoData = ['get', 'head', 'options', 'delete']
methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWidthData = ['post', 'put', 'patch']
methodsWidthData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
