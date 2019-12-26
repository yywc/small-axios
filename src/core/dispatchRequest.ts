import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHeader } from '../helpers/header'
import request from '../request'
import transform from './transform'

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return request(config).then(res => {
    return transformResponseData(res)
  })
}
