/**************************************************
 * Created by nanyuantingfeng on 12/09/2017 10:34.
 **************************************************/
import React from 'react'
import { Icon } from 'antd'
import { encodeWithPrefix, decodeWithPrefix } from './util'
import Footer from '../puppet/Footer'
import List from '../puppet/List'

export function createListFilter(columnName, filterDataSource) {
  const bus = this.bus
  const filterDropdownVisible = encodeWithPrefix(this.state, 'filterDropdownVisible', columnName)
  let LIST_DATA_INDEXES = encodeWithPrefix(this.state, 'LIST_DATA_INDEXES', columnName)
  const linkedValue = this.state.fetchParams.filters[columnName]

  if (linkedValue === undefined) {
    LIST_DATA_INDEXES = []
  }

  if (linkedValue && linkedValue.length > 0) {
    LIST_DATA_INDEXES = linkedValue.map(o => filterDataSource.findIndex(v => v.value === o))
  }

  const filtered = !!linkedValue && linkedValue.length > 0

  const onSearch = () => {
    const linkedValue = this.state.fetchParams.filters[columnName]
    bus.emit('column:filter', linkedValue, columnName)
    this.setState({
      ...decodeWithPrefix('filterDropdownVisible', false, columnName),
    })
  }

  const onChange = (value, indexes, b, c, fn) => {
    let { fetchParams } = this.state
    let { filters } = fetchParams
    filters = { ...filters, [columnName]: value }
    fetchParams = { ...fetchParams, filters }
    this.setState({
      fetchParams,
      ...decodeWithPrefix('LIST_DATA_INDEXES', indexes, columnName),
    }, fn)
  }

  const onReset = () => {
    onChange([], [], void 0, void 0, onSearch)
  }

  const filterDropdown = (
    <Footer onOk={onSearch}
            onReset={onReset}>
      <List dataSource={filterDataSource}
            selectedRowKeys={LIST_DATA_INDEXES}
            onChange={onChange}/>
    </Footer>
  )

  const filterIcon = (<Icon type="filter" style={{ color: filtered ? '#108ee9' : '#aaa' }}/>)

  const onFilterDropdownVisibleChange = (visible) => {
    this.setState(decodeWithPrefix('filterDropdownVisible', visible, columnName))
  }

  return {
    filterDropdown,
    filterIcon,
    filterDropdownVisible,
    onFilterDropdownVisibleChange,
  }
}
