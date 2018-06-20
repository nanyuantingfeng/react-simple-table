/**************************************************
 * Created by nanyuantingfeng on 21/09/2017 13:50.
 **************************************************/

import {
  isPayeeInfos,
  isBaseData,
  isDepartments,
  isSpecification,
  isStaffs,
} from './is'

function fixFilter (key, value, property) {
  const vv = split(value)

  if (isSpecification(property)) {
    return {[`${key}.name`]: vv}
  }

  if (isBaseData(property)) {
    return {
      [`${key}.code`]: vv,
      [`${key}.name`]: vv,
    }
  }

  if (isDepartments(property)) {
    return {
      [`${key}.name`]: vv,
      [`${key}.nameSpell`]: vv,
    }
  }

  if (isStaffs(property)) {
    return {
      [`${key}.name`]: vv,
    }
  }

  if (isPayeeInfos(property)) {
    return {
      [`${key}.name`]: vv,
      [`${key}.nameSpell`]: vv,
      [`${key}.bank`]: vv,
      [`${key}.branch`]: vv,
    }
  }

  return {[key]: vv}
}

function split (value) {
  if (typeof value !== 'string') return value
  return value.split(/[\s\t;,|]/).filter(v => !!v)
}

export default function (options, mapping) {
  let oo = {}

  const {filters} = options

  if (!filters) {
    return options
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key]
    const property = mapping[key]
    const obj = fixFilter(key, value, property)
    oo = {...oo, ...obj}
  })

  options.filters = oo
  return options
}
