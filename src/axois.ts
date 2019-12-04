import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import buildURL from './helpers/url'
import request from './request'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeader } from './helpers/header'

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeader(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

function processConfig(config: AxiosRequestConfig): void {
  config.headers = transformHeaders(config)
  config.url = transformUrl(config)
  config.data = transformRequestData(config)
}

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return request(config).then((res) => {
    return transformResponseData(res)
  })
}

export default axios
