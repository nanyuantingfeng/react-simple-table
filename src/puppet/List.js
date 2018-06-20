/**************************************************
 * Created by nanyuantingfeng on 13/09/2017 11:29.
 **************************************************/
import styles from '../../styles/List.module.less'
import React, { PureComponent } from 'react'
import { Checkbox, Radio } from 'antd'
import deepEqual from 'deep-equal'

export function createStore (initialState) {
  let state = initialState

  const listeners = []

  function setState (partial) {
    state = {...state, ...partial,}
    let i = -1
    while (++i < listeners.length) {
      listeners[i]()
    }
  }

  function getState () {
    return state
  }

  function subscribe (listener) {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  return {
    setState,
    getState,
    subscribe,
  }
}

export class ListItem extends PureComponent {

  unsubscribe () { return void 0}

  constructor (props) {
    super(props)
    this.state = {
      checked: this.getCheckState(props),
    }
  }

  componentDidMount () {
    this.subscribe()
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  subscribe () {
    const {store} = this.props
    this.unsubscribe = store.subscribe(() => {
      const checked = this.getCheckState(this.props)
      this.setState({checked})
    })
  }

  getCheckState (props) {
    const {store, defaultSelection, rowIndex} = props
    let checked = false
    if (store.getState().selectionDirty) {
      checked = store.getState().selectedRowKeys.indexOf(rowIndex) >= 0
    } else {
      checked = (store.getState().selectedRowKeys.indexOf(rowIndex) >= 0 ||
        defaultSelection.indexOf(rowIndex) >= 0)
    }
    return checked
  }

  render () {
    const {type, rowIndex, disabled, children, onChange} = this.props
    const {checked} = this.state

    if (type === 'radio') {
      return (
        <Radio disabled={disabled}
               onChange={onChange}
               value={rowIndex}
               checked={checked}
        >{children}</Radio>
      )
    }

    return (
      <Checkbox checked={checked}
                disabled={disabled}
                onChange={onChange}
      >{children}</Checkbox>
    )
  }
}

export default class List extends PureComponent {

  static defaultProps = {
    dataSource: [],
    className: ''
  }

  constructor (props, ...args) {
    super(props, ...args)
    this.store = createStore({selectedRowKeys: props.selectedRowKeys || []})
  }

  componentWillReceiveProps (nextProps) {
    const {selectedRowKeys} = nextProps
    if (!deepEqual(this.props.selectedRowKeys, selectedRowKeys)) {
      this.store.setState({selectedRowKeys})
    }
  }

  fnIndexes2DataIndexes (selectedRowKeys) {
    const {dataSource} = this.props
    return selectedRowKeys
      .map(index => dataSource[index].value)
  }

  handleItemChange = (e, value, index) => {
    const checked = e.target.checked
    let selectedRowKeys = this.store.getState().selectedRowKeys.slice(0)
    selectedRowKeys = selectedRowKeys.filter(k => k !== index)//删除当前的 index
    if (checked) { // 如果的checked 就再加进去
      selectedRowKeys.push(index)
    }
    this.store.setState({selectedRowKeys})
    //属性外面父组件
    const {onChange} = this.props
    onChange && onChange(this.fnIndexes2DataIndexes(selectedRowKeys), selectedRowKeys)
  }

  renderItems () {
    const {dataSource} = this.props
    return dataSource.map((line, index) => {
      const {text, label, value} = line
      return (
        <li key={index} className={`ant-dropdown-menu-item`}>
          <ListItem store={this.store}
                    rowIndex={index}
                    defaultSelection={[]}
                    onChange={(e) => this.handleItemChange(e, value, index)}
          >{text || label}</ListItem>
        </li>
      )
    })
  }

  render () {
    const {className} = this.props
    return (
      <ul
        className={`${styles.wrapper} ${className} ant-dropdown-menu-vertical ant-dropdown-menu-without-submenu ant-dropdown-menu-root`}>
        {this.renderItems()}
      </ul>
    )
  }
}
