/**************************************************
 * Created by nanyuantingfeng on 07/09/2017 16:50.
 **************************************************/
import styles from './demo.module.less';
import React, { PureComponent } from 'react';
import MessageCenter from 'message-center.js';
import DataGrid from '../src';

import {
  createFakeData,
  createColumns,
  createColumnsSwitcherDataIndexes,
} from './mockdata';

const baseDataProperties = require('./properties');
const DATA_DEMO = createFakeData(20, 20);

export default class DEMO0 extends PureComponent {
  bus = new MessageCenter();

  buttons = [
    {text: '导出全部', isBindMultiSelect: false, isBindTotal: true},
    {text: '导出选中'},
    {text: '打印'},
  ];

  pageSize = 20;

  constructor(props, ...args) {
    super(props, ...args);
    const scene = 'all';
    const switcherDataIndexes = createColumnsSwitcherDataIndexes(scene);
    this.state = {
      dataSource: [],
      total: 0,
      scene,
      switcherDataIndexes,
    };
  }

  componentDidMount() {
    this.fetchData({
      page: {currentPage: 1, pageSize: this.pageSize},
    }).then(data => {
      const {dataSource, total} = data;
      this.setState({dataSource, total});
    });
  }

  fetchData = (params) => {
    console.log('fetch::', params);

    const {page, scene} = params;
    scene && this.setState({scene});
    const {currentPage, pageSize} = page;
    return new Promise((resolve) => {
      setTimeout(() => {
        const {count, items} = DATA_DEMO;
        resolve({
          dataSource: items,
          total: count,
        });
      }, 1000);
    });
  };

  componentWillMount() {
    this.bus.on('buttons:click', this.handleButtonsClick);
    this.bus.on('table:row:click', this.handleTableRowClick);
  }

  componentWillUnmount() {
    this.bus.un('buttons:click', this.handleButtonsClick);
    this.bus.un('table:row:click', this.handleTableRowClick);
  }

  handleButtonsClick = (meta) => {
    const keys = this.bus.getSelectedRowKeys();
    const maps = this.bus.getSelectedRowData();

    console.log('handleButtonsClick???meta', meta);
    console.log('handleButtonsClick???keys', keys);
    console.log('handleButtonsClick???maps', maps);
  };

  handleTableRowClick = (record, index, event) => {
    console.log('handleTableRowClick???', record, index);
  };

  handleColumnsSwitcherChange = (switcherDataIndexes) => {
    this.setState({switcherDataIndexes});
  };

  render() {
    const {dataSource, total, switcherDataIndexes} = this.state;
    const columns = createColumns(baseDataProperties);

    return (
      <div className={styles.wrapper}>
        <DataGrid bus={this.bus}
                  dataSource={dataSource}
                  columns={columns}
                  columnsSwitcherSelectedDataIndexes={switcherDataIndexes}
                  onColumnsSwitcherChange={this.handleColumnsSwitcherChange}
                  total={total}
                  pageSize={this.pageSize}
                  rowKey={(e, i) => e.id + ':' + i}
                  bordered={true}
                  scroll={{y: 450}}
                  isMultiSelect={false}
                  buttons={this.buttons}
                  fetch={this.fetchData}/>
      </div>
    );

  }
}
