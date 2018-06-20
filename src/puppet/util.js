/**************************************************
 * Created by nanyuantingfeng on 15/09/2017 12:01.
 **************************************************/
import { parseFilter } from '../filter'
import { parseRender } from '../render'

export function mergeOthers2Columns (columns, orders = {}) {
  return columns.map(line => {
    let {render, dataIndex} = line
    const ff = this::parseFilter(line)
    render = render ? render : this::parseRender(line)
    const sortOrder = orders[dataIndex] || false
    return {...line, ...ff, render, sortOrder}
  })
}

export function closest (element, selector) {
  const matchesSelector = element.matches
    || element.webkitMatchesSelector
    || element.mozMatchesSelector
    || element.msMatchesSelector

  while (element) {
    if (matchesSelector.call(element, selector)) break
    element = element.parentElement
  }
  return element
}
