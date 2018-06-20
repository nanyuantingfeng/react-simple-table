/**************************************************
 * Created by nanyuantingfeng on 12/09/2017 16:29.
 **************************************************/

import { createTextFilter } from './createTextFilter'
import { createDateRangeFilter } from './createDateRangeFilter'
import { createListFilter } from './createListFilter'
import { createNumberRangeFilter } from './createNumberRangeFilter'

export function getFilterFn (type) {

  switch (type) {
    case 'date' :
    case 'shortdate' :
    case 'dateRange' :
      return createDateRangeFilter
    case 'list' :
      return createListFilter
    case 'number' :
    case 'money' :
      return createNumberRangeFilter
    default:
      return createTextFilter
  }

}

export function parseFilter (line) {
  const {filterType, dataIndex, filterDataSource} = line
  if (!filterType) {
    return void 0
  }
  const fn = getFilterFn(filterType)
  return this::fn(dataIndex, filterDataSource)
}

export function mergeFiltersInColumns (columns) {
  return columns.map(line => {
    const oo = this::parseFilter(line)
    return {...line, ...oo}
  })
}
