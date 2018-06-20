/**
 *  Created by panwei on 2018/5/28 下午4:16.
 */
import React, { PureComponent } from 'react'
import { Pagination } from 'antd'
import styles from '../../styles/EKBDataGrid.module.less'

const defaultSizeOptions = ['10', '20', '30', '40']

export default class EKBPagination extends PureComponent {

  constructor(props) {
    super(props)
    const { currentPage } = props
    this.state = { currentPage: currentPage || 1 }
  }

  componentWillReceiveProps(nextPorps) {
    console.log('===+=' + nextPorps.currentPage)
    console.log('=====' + this.props.currentPage)
    // if (nextPorps.currentPage !== this.props.currentPage) {
    //   this.setState({ currentPage: nextPorps.currentPage })
    // }
  }

  handlePaginationChanged = (page, pageSize) => {
    const { onPageChanged } = this.props
    onPageChanged && onPageChanged(page, pageSize)
    // this.setState({ currentPage: page })
  }

  handleOnShowSizeChange = (current, size) => {
    const { onPageSizeChanged } = this.props
    onPageSizeChanged && onPageSizeChanged(current, size)
  }

  render() {
    const { total, pageSize, showQuickJumper = false, showSizeChanger = false, pageSizeOptions, paginationSimple, currentPage } = this.props
    const _pageSizeOptions = showSizeChanger ? pageSizeOptions ? pageSizeOptions : defaultSizeOptions : []
    // const { currentPage } = this.state
    const simple = !!paginationSimple
    return <div className={styles.pagination}>
      <Pagination
        total={total}
        showTotal={(total, range) => `共${total}条`}
        defaultPageSize={pageSize}
        current={currentPage}
        showQuickJumper={showQuickJumper}
        showSizeChanger={showSizeChanger}
        pageSizeOptions={_pageSizeOptions}
        simple={simple}
        onChange={this.handlePaginationChanged}
        onShowSizeChange={this.handleOnShowSizeChange}
      />
    </div>
  }
}