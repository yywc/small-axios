import { AxiosTransformer } from '../types'
import { isArray, isDef } from '../helpers/util'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!isDef(fns)) {
    return data
  }

  if (!isArray(fns)) {
    fns = [fns!]
  }

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data

}
