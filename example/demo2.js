/**
 *  Created by panwei on 2018/5/28 下午9:32.
 */
import styles from './demo0.module.less'
import React, { PureComponent } from 'react'
import DataGrid from '../src/DataGrid/index'
// import EKBDataGrid from '../build/lib/index'
import { EKBDataGrid } from '../src/index'
import fetchFixer from './fetchFixer'

import {
  createFakeData,
  createColumns,
  createFixedColumns,
  createColumnsSwitcherDataIndexes,
  createActionColumn,
  getColumnPropertyMapping,
} from './mockdata'

const baseDataProperties = require('./propertySet.json')

import { MessageCenter } from 'ekb-messagecenter'

export default class DEMO0 extends PureComponent {
  bus = new MessageCenter()

  buttons = [
    { text: '支付', type: 'primary' },
    { text: '驳回' },
    { text: '导出全部', isBindMultiSelect: false, isBindTotal: true },
    { text: '导出选中' },
    { text: '打印' },
  ]

  scenes = [
    { text: '全部', scene: 'all', active: true, sceneIndex: 'all' },
    { text: '报销单', scene: 'expense', sceneIndex: 'expense' },
    { text: '借款单', scene: 'loan', sceneIndex: 'loan' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    { text: '申请单', scene: 'requisition', sceneIndex: 'requisition' },
    {
      text: '112',
      defaultColumns: ['flowId.form.title', 'flowId.form.code', 'flowId.form.specificationId',
        'flowId.form.submitDate', 'flowId.form.submitterId', 'flowId.state', 'action'],
      sceneIndex: '112',
      filters: {
        'flowId.form.loanDepartment': ['SU06uwrcmk0000:19031410']
      }
    }
  ]

  pageSize = 40

  constructor(props, ...args) {
    super(props, ...args)
    const scene = 'all'
    const switcherDataIndexes = createColumnsSwitcherDataIndexes(scene, 'flowId.form')
    this.state = {
      dataSource: [],
      total: 0,
      scene,
      switcherDataIndexes,
      selectIndex: undefined
    }
  }

  componentDidMount() {
    this.fetchData({
      page: { currentPage: 1, pageSize: this.pageSize },
      scene: 'all'
    }).then(data => {
      const { dataSource, total } = data
      this.setState({ dataSource, total })
    })
  }

  fetchData = (params) => {
    console.log('fetch::', params)
    console.log('fetchFixer::', fetchFixer(params, getColumnPropertyMapping()))

    const { page, scene } = params
    scene && this.setState({ scene })
    const { currentPage, pageSize } = page
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dataSource: this::createFakeData(currentPage, pageSize),
          total: 1000,
        })
      }, 1000)
    })
  }

  componentWillMount() {
    this.bus.on('buttons:click', this.handleButtonsClick)
    this.bus.on('table:row:click', this.handleTableRowClick)
  }

  componentWillUnmount() {
    this.bus.un('buttons:click', this.handleButtonsClick)
    this.bus.un('table:row:click', this.handleTableRowClick)
  }

  handleButtonsClick = (meta) => {
    const keys = this.bus.getSelectedRowKeys()
    const maps = this.bus.getSelectedRowData()

    console.log('handleButtonsClick???meta', meta)
    console.log('handleButtonsClick???keys', keys)
    console.log('handleButtonsClick???maps', maps)
  }

  handleTableRowClick = (record, index, event) => {
    console.log('handleTableRowClick???', record, index)
    this.setState({ selectIndex: index })
  }

  handleColumnsSwitcherChange = (switcherDataIndexes) => {
    this.setState({ switcherDataIndexes })
  }

  handleSceneChange = (scene) => {
    const switcherDataIndexes = createColumnsSwitcherDataIndexes(scene, 'flowId.form')
    this.setState({ scene, switcherDataIndexes })
  }

  handleEditScenes = () => {
    console.log('--------------')
    console.log('编辑场景')
  }

  renderMenuBar() {
    return <div style={{ flexShrink: 0, marginRight: 10 }}>
      菜单栏
    </div>
  }

  render() {
    const { dataSource, total, switcherDataIndexes, selectIndex } = this.state
    const columns = createFixedColumns(baseDataProperties, 'flowId.form',
      {
        'state': 'left',
        'flowId.form.specificationId': 'left',
      })
    columns.push(createActionColumn(this.bus))
    return (
      <div className={styles.wrapper}>
        <EKBDataGrid
          bus={this.bus}
          dataSource={dataSource}
          columns={columns}
          columnsSwitcherSelectedDataIndexes={switcherDataIndexes}
          onColumnsSwitcherChange={this.handleColumnsSwitcherChange}
          onSceneChange={this.handleSceneChange}
          onEditScenes={this.handleEditScenes}
          total={total}
          pageSize={this.pageSize}
          rowKey={e => e.flowId.id}
          bordered={true}
          scroll={{ y: 490 }}
          buttons={this.buttons}
          scenes={this.scenes}
          menuBarView={this.renderMenuBar}
          paginationSimple={true}
          wrapperHeaderContentStyle={{ marginTop: 24 }}
          rowClassName={(record, index) => index === selectIndex ? styles.table_select_row_bg : styles.table_row_bg}
          // isMultiSelect={false}
          // isSingleSelect={true}
          rightFixedColumnCount={1}
          fetch={this.fetchData}/>
      </div>
    )

  }
}