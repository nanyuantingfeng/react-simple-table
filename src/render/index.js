/**************************************************
 * Created by nanyuantingfeng on 15/09/2017 11:41.
 **************************************************/
import React from 'react'
import {
  TextCell, NumberCell, DateCell, ShortDateCell, DateRangeCell, RefCell, MoneyCell,
} from '../puppet/Cells'

const createRender = (Component) => (columns) =>
  (value, record, index) => (<Component columns={columns} value={value}
                                        record={record} index={index}/>)

export function getRenderFn (type) {
  switch (type) {
    case 'ref' :
      return createRender(RefCell)
    case 'date' :
      return createRender(DateCell)
    case 'shortdate' :
      return createRender(ShortDateCell)
    case 'dateRange' :
      return createRender(DateRangeCell)
    case 'number' :
      return createRender(NumberCell)
    case 'money' :
      return createRender(MoneyCell)
    default:
      return createRender(TextCell)
  }
}

export function parseRender (line) {
  const {dataType} = line
  const fn = getRenderFn(dataType)
  return this::fn(line)
}

export function mergeRendersInColumns (columns) {
  return columns.map(line => {
    const render = this::parseRender(line)
    return {...line, render}
  })
}
