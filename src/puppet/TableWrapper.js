/**************************************************
 * Created by nanyuantingfeng on 09/02/2017 18:24.
 **************************************************/
import styles from '../../styles/TableWrapper.module.less'
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

function TableWrapper(props) {
  const handleChange = (pagination, filters, sorter) => {
    const { bus } = props
    bus.emit('column:sort', sorter)
  }

  const handleTableRowClick = (record, index, event) => {
    const { bus } = props
    bus.emit('table:row:click', record, index, event)
  }

  let {
        scroll, fixScrollX, fixedColumn, bordered, dataSource, columns, rowSelection, showColumnsDataIndexes, loading, children, ...others
      } = props

  // 如果此值不为 undefined , 就说明有隐藏的列
  if (Array.isArray(showColumnsDataIndexes)) {
    columns = columns.filter(({ dataIndex }) => !!~showColumnsDataIndexes.indexOf(dataIndex))
  }

  columns = fixedColumn ? fixedColumn(columns) : columns

  const x = fixScrollX ? fixScrollX(columns) : columns.filter(
    line => !line.fixed
  ).map(
    line => line.width = line.width || 200
  ).reduce((a, b) => a + b, 0) + 99

  scroll = { ...scroll, x }

  return (
    <div className={styles.tableWrapper}>
      <Table
        {...others}
        loading={loading}
        pagination={false}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        bordered={bordered}
        onChange={handleChange}
        onRowClick={handleTableRowClick}
        scroll={scroll}>
        {children}
      </Table>
    </div>
  )
}

TableWrapper.propTypes = {
  //数据源
  dataSource: PropTypes.array.isRequired,
  //列Schema
  columns: PropTypes.array.isRequired,
  //是否设置行列线
  bordered: PropTypes.bool,
  // 滚动修正
  scroll: PropTypes.object,
  // 加载中
  loading: PropTypes.bool,

  onChange: PropTypes.func,
  //修正X
  fixScrollX: PropTypes.func,

}

TableWrapper.defaultProps = {
  columns: [],
  dataSource: [],
  bordered: false,
}

export default TableWrapper
