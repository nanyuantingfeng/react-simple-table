/**************************************************
 * Created by nanyuantingfeng on 11/09/2017 14:23.
 **************************************************/
import React from 'react'
import { DatePicker, Icon } from 'antd'

import Footer from '../puppet/Footer'
import {
  encodeWithPrefix,
  decodeWithPrefix,
  toArrayMoment,
  toSELong,
  sE2Array,
  array2SE,
} from './util'

export function createDateRangeFilter (columnName) {
  const bus = this.bus
  const filterDropdownVisible = encodeWithPrefix(this.state, 'filterDropdownVisible', columnName)
  const canVisibleFalse = encodeWithPrefix(this.state, 'canVisibleFalse', columnName)
  const linkedValue = this.state.fetchParams.filters[columnName]
  const filtered = !!linkedValue

  const onSearch = () => {
    let linkedValue = this.state.fetchParams.filters[columnName]
    linkedValue = toSELong(linkedValue)
    bus.emit('column:filter', linkedValue, columnName)
    this.setState({
      ...decodeWithPrefix('filterDropdownVisible', false, columnName),
    })
  }

  const onChange = (range, a, b, c, fn) => {
    const val = range
    let {fetchParams} = this.state
    let {filters} = fetchParams
    const oo = toSELong(array2SE(val))
    filters = {...filters, [columnName]: oo}
    fetchParams = {...fetchParams, filters}
    this.setState({fetchParams}, fn)
  }

  const onReset = () => {
    onChange(void 0, void 0, void 0, void 0, onSearch)
  }

  const onOpenChange = (status) => {
    this.setState({... decodeWithPrefix('canVisibleFalse', !status, columnName)})
  }

  const value = toArrayMoment(sE2Array(linkedValue))

  const filterDropdown = (
    <Footer onOk={onSearch}
            onReset={onReset}>
      <DatePicker.RangePicker value={value}
                              onOpenChange={onOpenChange}
                              onChange={onChange}
                              onSearch={onSearch}
                              onPressEnter={onSearch}/>
    </Footer>
  )

  const filterIcon = (<Icon type="filter" style={{color: filtered ? '#108ee9' : '#aaa'}}/>)

  const onFilterDropdownVisibleChange = (visible) => {
    if (canVisibleFalse === true || canVisibleFalse === undefined) {
      this.setState(decodeWithPrefix('filterDropdownVisible', visible, columnName))
    }
  }

  return {
    filterDropdown,
    filterIcon,
    filterDropdownVisible,
    onFilterDropdownVisibleChange,
  }
}
