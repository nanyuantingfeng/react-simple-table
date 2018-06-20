/**************************************************
 * Created by nanyuantingfeng on 13/09/2017 15:22.
 **************************************************/
import styles from '../../styles/ColumnsSwitcher.module.less'
import React, { PureComponent } from 'react'
import { Dropdown } from 'antd'
import List from './List'
import Footer from './Footer'
import ICON from '../../styles/images/filter.svg'
import deepEqual from 'deep-equal'
import { closest } from './util'

function keys2Indexes(dataSource, selectedDataIndexes) {
  let oo = []
  dataSource.forEach(({ dataIndex }, index) => {
    if (!!~selectedDataIndexes.indexOf(dataIndex)) {
      oo.push(index)
    }
  })
  return oo
}

export default class ColumnsSwitcher extends PureComponent {

  constructor(props, ...args) {
    super(props, ...args)
    const { selectedDataIndexes } = props
    this.state = {
      selectedDataIndexes,
      selectedDataIndexesOrigin: selectedDataIndexes,
      visible: false,
    }
  }

  __NeedChangeOrigin = false

  componentWillMount() {
    const { bus } = this.props
    bus.on('scene:changed', this.handleSceneChanged)
    document.body.addEventListener('click', this.handleHide)
  }

  componentWillUnmount() {
    const { bus } = this.props
    bus.un('scene:changed', this.handleSceneChanged)
    document.body.removeEventListener('click', this.handleHide)
  }

  handleSceneChanged = () => {
    this.__NeedChangeOrigin = true
  }

  componentWillReceiveProps(nextProps) {
    const { selectedDataIndexes } = nextProps
    if (!deepEqual(this.props.selectedDataIndexes, selectedDataIndexes)) {
      this.setState({ selectedDataIndexes })
      if (this.__NeedChangeOrigin) {
        this.__NeedChangeOrigin = false
        this.setState({ selectedDataIndexesOrigin: selectedDataIndexes })
      }
    }
  }

  handleListChange = (selectedDataIndexes) => {
    this.setState({ selectedDataIndexes })
  }

  handleOk = () => {
    this.setState({ visible: false })
    const { onChange } = this.props
    const { selectedDataIndexes } = this.state
    onChange && onChange(selectedDataIndexes)
  }

  handleReset = () => {
    this.setState({ visible: false })
    const { selectedDataIndexesOrigin } = this.state
    const { onChange } = this.props
    this.setState({ selectedDataIndexes: selectedDataIndexesOrigin })
    onChange && onChange(selectedDataIndexesOrigin)
  }

  handleShow = () => {
    this.setState({ visible: true })
  }

  handleHide = (e) => {
    if (closest(e.target, 'div.__columnsSwitch_footer_wrapper')) {
      return false
    }
    this.setState({ visible: false })
  }

  renderMenus() {
    const { dataSource } = this.props
    const { selectedDataIndexes } = this.state
    const selectedRowKeys = keys2Indexes(dataSource, selectedDataIndexes)
    return (
      <Footer className={'__columnsSwitch_footer_wrapper'}
              onOk={this.handleOk}
              onReset={this.handleReset}
      >
        <List dataSource={dataSource}
              onChange={this.handleListChange}
              selectedRowKeys={selectedRowKeys}
              className={styles.bodyWrapper}
        />
      </Footer>
    )
  }

  render() {
    const { dataSource, top, style } = this.props
    if (!dataSource || !dataSource.length) { return null}
    const { visible } = this.state
    return (
      <Dropdown
        overlay={this.renderMenus()}
        visible={visible}
      >
        <div className={styles.switchWrapper}
             style={{ top: top , ...style}}
             onClick={this.handleShow}
        >
          <img src={ICON}/>
        </div>
      </Dropdown>
    )
  }
}
