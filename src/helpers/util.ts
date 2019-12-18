const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isArray(val: any): val is Array<any> {
  return toString.call(val) === '[object Array]'
}

export function isDef(val: any): Boolean {
  return val !== null && val !== undefined && val !== ''
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any // 加分号防止压缩后变成函数调用
  }
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      for (const [key, value] of Object.entries(obj)) {
        if (isObject(value)) {
          if (isObject(result[key])) {
            deepMerge(result[key], value)
          } else {
            result[key] = deepMerge({}, value)
          }
        } else {
          result[key] = value
        }
      }
    }
  })

  return result
}
