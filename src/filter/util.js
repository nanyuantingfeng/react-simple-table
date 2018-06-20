/**************************************************
 * Created by nanyuantingfeng on 15/09/2017 14:20.
 **************************************************/
import moment, { isMoment } from 'moment'
import 'moment/locale/zh-cn'

function fix000000 (oo) {

  if (oo === undefined || oo === null) {
    return void 0
  }

  oo = isMoment(oo) ? oo : moment(oo)
  oo = oo.hours(0).minutes(0).seconds(0)

  return oo
}

function fix235959 (oo) {

  if (oo === undefined || oo === null) {
    return void 0
  }

  oo = isMoment(oo) ? oo : moment(oo)
  oo = oo.hours(23).minutes(59).seconds(59)

  return oo
}

export function toArrayMoment (array = []) {
  let start = fix000000(array[0])
  let end = fix235959(array[1])
  return [start, end]
}

export function toSELong (obj) {
  if (!obj) {
    return void 0
  }

  let {start, end} = obj

  start = fix000000(start)
  end = fix235959(end)

  start = start.valueOf()
  end = end.valueOf()

  return {start, end}
}

export function array2SE (arr) {

  if (Array.isArray(arr)) {
    return {
      start: arr[0],
      end: arr[1],
    }
  }

  return void 0
}

export function sE2Array (obj) {
  if (Array.isArray(obj)) {
    return obj
  }
  const {start, end} = obj || {}
  return [start, end]
}

export function prefixWithString (key, prefixString = '') {
  return `${prefixString}_$_${key}`
}

export function encodeWithPrefix (object, key, prefixString) {
  return object[prefixWithString(key, prefixString)]
}

export function decodeWithPrefix (key, val, prefixString) {
  return {[prefixWithString(key, prefixString)]: val}
}
