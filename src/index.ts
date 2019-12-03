import { AxiosRequestConfig } from '../types'
import buildURL from './helpers/url'
import xhr from './xhr'
import transformRequest from './helpers/data'
import processHeader from './helpers/header'

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

function processConfig(config: AxiosRequestConfig): void {
  config.headers = transformHeaders(config)
  config.url = transformUrl(config)
  config.data = transformRequestData(config)
}

function axios(config: AxiosRequestConfig) {
  processConfig(config)
  xhr(config)
}

export default axios
