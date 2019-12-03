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

/**
 * 不考虑 buffer、date、symbol
 * @param val
 */
export function isEmpty(val: any): Boolean {
  if (val === null || val === undefined) {
    return true
  }
  const type = toString.call(val)
  if (isArray(val) || type === '[object Arguments]' || type === '[object String]') {
    return !val.length
  }
  if (type === '[object Function]') {
    return isEmpty(val())
  }
  if (type === '[object Map]' || type === '[object Set]') {
    return !val.size
  }
  if (isObject(val)) {
    return !Object.keys(val).length
  }
  return val === 0 || false
}
