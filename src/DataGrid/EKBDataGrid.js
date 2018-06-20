/**
 *  Created by panwei on 2018/5/28 下午3:17.
 */
import React, { PureComponent } from 'react'
import styles from '../../styles/EKBDataGrid.module.less'
import TableWrapper from '../puppet/TableWrapper'
import Header from './Header'
import { mergeOthers2Columns } from '../puppet/util'
import { MessageCenter } from 'ekb-messagecenter'
import clone from 'clone'
import ColumnsSwitcher from '../puppet/ColumnsSwitcher'
import deepEqual from 'deep-equal'

function getRowKeyFn(rowKey) {
  if (typeof rowKey === 'string') {
    return (record) => record[rowKey]
  }
  return rowKey
}

export default class EKBDataGrid extends PureComponent {

  static defaultProps = {
    loading: false,
    dataSource: [],
    total: 0,
    pageSize: 10,
    selectedRowKeys: [],
    highlightWords: [],
    isMultiSelect: true,
    isSingleSelect: false,
    isButtonsBindMultiSelect: true,
    fetchParams: {
      page: { currentPage: 1, pageSize: 10 },
      searchText: '',
      filters: {},
      sorters: {},
      scene: undefined,
    },
    columnMinWidth: 200,
    wrapperStyle: {},
    wrapperHeaderContentStyle: {},
    wrapperColumnsSwitcherStyle: {},
  }

  __selectedRowData = {}

  constructor(props, ...args) {
    super(props, ...args)
    this.bus = props.bus || new MessageCenter()
    const { dataSource, fetchParams, rowKey, columnsSwitcherSelectedDataIndexes, total, selectedRowKeys, loading } = props
    this.state = {
      dataSource,
      columnsSwitcherSelectedDataIndexes,
      headerHeight: 54,
      isShowMoreScenes: false,
      total,
      selectedRowKeys,
      loading,
      fetchParams: {
        ...fetchParams,
      },
    }
    this.__rowKeyFn = getRowKeyFn(rowKey)
    this.__registerAPI2Bus()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      this.setState({
        dataSource: nextProps.dataSource,
        selectedRowKeys: [], //数据源更新 说明当前控件重新渲染了
      })
      this.__selectedRowData = {}
    }
    if (this.props.total !== nextProps.total) {
      this.setState({ total: nextProps.total })
    }

    if (this.props.columns !== nextProps.columns) {
      this.setState({ columns: this::mergeOthers2Columns(nextProps.columns) })
    }

    const { columnsSwitcherSelectedDataIndexes } = nextProps

    if (!deepEqual(this.props.columnsSwitcherSelectedDataIndexes, columnsSwitcherSelectedDataIndexes)) {
      this.setState({ columnsSwitcherSelectedDataIndexes })
    }
  }

  componentWillMount() {
    this.bus.watch('dataGrid:fetch:data', this.fetch)
    this.bus.on('pagination:changed', this.handlePagination)
    this.bus.on('column:filter', this.handleColumnFilter)
    this.bus.on('column:sort', this.handleColumnSort)
    this.bus.watch('get:column:checked:value', this.handleGetColumnChecked)
  }

  componentWillUnmount() {
    this.bus.un('dataGrid:fetch:data', this.fetch)
    this.bus.un('pagination:changed', this.handlePagination)
    this.bus.un('column:filter', this.handleColumnFilter)
    this.bus.un('column:sort', this.handleColumnSort)
    this.bus.un('get:column:checked:value', this.handleGetColumnChecked)
  }

  __registerAPI2Bus() {
    this.bus.getSelectedRowKeys = () => this.state.selectedRowKeys.slice(0)

    this.bus.clearSelectedRowKeys = () => {
      this.setState({ selectedRowKeys: [] })
      this.__selectedRowData = {}
    }

    this.bus.reload = (params) => this.fetch(params)
    this.bus.scenesChange = this.handleScenesClick
    this.bus.getFetchParams = () => clone(this.state.fetchParams)
    this.bus.getSelectedRowData = () => {
      const keys = this.state.selectedRowKeys.slice(0)
      const oo = {}
      keys.forEach(key => oo[key] = this.__selectedRowData[key])
      return clone(oo)
    }
  }

  fetch = (params) => {
    const { fetch } = this.props
    this.setState({ loading: true })
    const { fetchParams } = this.state
    params = { ...fetchParams, ...params }
    return fetch(params).then(data => {
      const { dataSource, total } = data
      this.setState({
        loading: false,
        fetchParams: params,
        dataSource,
        total,
      })
    })
  }

  handleSelectChange = (selectedRowKeys, selectedRowData) => {
    this.setState({ selectedRowKeys })
    const rowKeyFn = this.__rowKeyFn
    selectedRowData.forEach(line => {
      this.__selectedRowData[rowKeyFn(line)] = line
    })
    this.bus.emit('select:change', selectedRowKeys, this.__selectedRowData)
  }

  handlePagination = (currentPage, pageSize) => {
    this.setState({ currentPage })
    this.fetch({ page: { currentPage, pageSize } })
  }

  handleColumnFilter = (text, columnName) => {
    let { fetchParams } = this.state
    let { filters, page } = fetchParams
    filters = { ...filters, [columnName]: text }
    page = { ...page, currentPage: 1 }
    this.fetch({ filters, page })
    this.setState({ currentPage: 1 })
  }

  handleGetColumnChecked = () => {
    let { columnsSwitcherSelectedDataIndexes } = this.state
    return columnsSwitcherSelectedDataIndexes
  }

  handleColumnSort = (sorter) => {
    const { columnKey, field, order } = sorter
    const sorters = {}
    if (columnKey && order) {
      sorters[columnKey] = order
    }
    this.fetch({ sorters })
  }

  handlePagination = (currentPage, pageSize) => {
    this.setState({ currentPage })
    this.fetch({ page: { currentPage, pageSize } })
  }

  handleColumnsSwitch = (columnsSwitcherSelectedDataIndexes) => {
    this.setState({ columnsSwitcherSelectedDataIndexes })
    let { onColumnsSwitcherChange } = this.props
    onColumnsSwitcherChange && onColumnsSwitcherChange(columnsSwitcherSelectedDataIndexes)
  }

  handleShowMoreSence = (isShowMoreScenes) => {
    this.setState({ isShowMoreScenes })
  }

  handleHeaderHeightChanged = (headerHeight) => {
    this.setState({ headerHeight })
  }

  handleFixScrollX = (columns) => {
    const { columnMinWidth } = this.props
    return columns.map(
      line => line.width || columnMinWidth
    ).reduce((a, b) => a + b, 0)
  }

  handleFixedColumn = (columns) => {
    const { columnMinWidth, tableWidth } = this.props
    const electment = document.getElementById('ekbc-table')
    if (electment) {
      const offsetWidth = tableWidth || electment.clientWidth
      const totalWidth = columns.reduce((sum, c) => c.width + sum, 0)
      let width = columnMinWidth
      if (totalWidth < offsetWidth) {
        width = offsetWidth / columns.length
      }
      columns.forEach(c => c.width = width)
    }
    return columns
  }

  render() {

    const {
            columns,
            isMultiSelect,
            isSingleSelect,
            getCheckboxProps,
            wrapperStyle,
            disabledSwitcher,
            wrapperColumnsSwitcherStyle,
            scroll,
            scenes,
            buttons,
            ...others
          } = this.props

    const {
            dataSource, total, loading,
            selectedRowKeys,
            fetchParams,
            columnsSwitcherSelectedDataIndexes,
            headerHeight,
            isShowMoreScenes,
          } = this.state
    const bus = this.bus
    const { sorters = {} } = fetchParams
    const columns2 = this::mergeOthers2Columns(columns, sorters)

    const ColumnsSwitcherTop = scenes && buttons ? 114 : 86
    const fixScroll = isShowMoreScenes ? Object.assign({}, scroll, { y: scroll.y - headerHeight + 49 }) : scroll
    let rowSelection = null
    if (isMultiSelect) {
      rowSelection = { selectedRowKeys, onChange: this.handleSelectChange }
    }
    let className = styles.dataGridWrapper
    if (isSingleSelect) {
      className += ' ' + styles.single_election_table
    }
    if (getCheckboxProps) {
      rowSelection.getCheckboxProps = getCheckboxProps
    }

    return <div className={className} style={wrapperStyle}>
      {!disabledSwitcher &&
       <ColumnsSwitcher style={wrapperColumnsSwitcherStyle}
                        top={ColumnsSwitcherTop}
                        bus={bus}
                        dataSource={columns2}
                        selectedDataIndexes={columnsSwitcherSelectedDataIndexes}
                        onChange={this.handleColumnsSwitch}
       />}
      <Header {...this.props}
              total={total}
              selected={selectedRowKeys.length}
              onShowMoreSence={this.handleShowMoreSence}
              onHeaderHeightChanged={this.handleHeaderHeightChanged}/>

      <div className={styles.tableContent} id='ekbc-table'>
        <TableWrapper
          {...others}
          scroll={fixScroll}
          fixScrollX={this.handleFixScrollX}
          fixedColumn={this.handleFixedColumn}
          bus={bus}
          loading={loading}
          dataSource={dataSource}
          columns={columns2}
          showColumnsDataIndexes={columnsSwitcherSelectedDataIndexes}
          rowSelection={rowSelection}
          total={total}
        />
      </div>
    </div>
  }
}