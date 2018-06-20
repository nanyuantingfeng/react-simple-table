/**************************************************
 * Created by nanyuantingfeng on 12/09/2017 11:33.
 **************************************************/
import React from 'react'
import { Input, Icon } from 'antd'
import Footer from '../puppet/Footer'
import { encodeWithPrefix, decodeWithPrefix } from './util'

export function createTextFilter(columnName) {
  const bus = this.bus
  const filterDropdownVisible = encodeWithPrefix(this.state, 'filterDropdownVisible', columnName)
  const linkedValue = this.state.fetchParams.filters[columnName] || ''
  const filtered = !!linkedValue

  const onSearch = () => {
    const linkedValue = this.state.fetchParams.filters[columnName]
    bus.emit('column:filter', linkedValue, columnName)
    this.setState({
      ...decodeWithPrefix('filterDropdownVisible', false, columnName),
    })
  }

  const onChange = ({ target: { value } }, a, b, c, fn) => {
    let { fetchParams } = this.state
    let { filters } = fetchParams
    filters = { ...filters, [columnName]: value }
    fetchParams = { ...fetchParams, filters }
    this.setState({ fetchParams }, fn)
  }

  const onReset = () => {
    onChange({ target: { value: '' } }, void 0, void 0, void 0, onSearch)
  }

  const filterDropdown = (
    <Footer onOk={onSearch}
            onReset={onReset}>
      <Input.Search value={linkedValue}
                    onChange={onChange}
                    onSearch={onSearch}
                    onPressEnter={onSearch}/>
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
