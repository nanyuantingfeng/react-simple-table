/**************************************************
 * Created by nanyuantingfeng on 12/09/2017 11:51.
 **************************************************/
import styles from '../../styles/DataGrid.module.less';
import React, { PureComponent } from 'react';
import { Pagination } from 'antd';
import MessageCenter from 'message-center.js';
import TableWrapper from './TableWrapper';
import Buttons from './Buttons';
import SelectAllBtn from './SelectAllBtn';
import Scenes from './Scenes';
import ColumnsSwitcher from './ColumnsSwitcher';
import { mergeOthers2Columns } from './util';
import clone from 'clone';
import deepEqual from 'deep-equal';
import SearchInput from './SearchInput';

function getRowKeyFn(rowKey) {

  if (typeof rowKey === 'string') {
    return (record) => record[rowKey];
  }

  return rowKey;
}

export default class DataGrid extends PureComponent {

  static defaultProps = {
    loading: false,
    dataSource: [],
    total: 0,
    pageSize: 10,
    selectedRowKeys: [],
    highlightWords: [],
    isMultiSelect: true,
    isButtonsBindMultiSelect: true,
    fetchParams: {
      page: {currentPage: 1, pageSize: 10},
      searchText: '',
      filters: {},
      sorters: {},
      scene: undefined,
    },

    wrapperStyle: {},
    wrapperHeaderContentStyle: {},
    wrapperColumnsSwitcherStyle: {},
  };

  scenesBox = null;

  constructor(props, ...args) {
    super(props, ...args);
    this.bus = props.bus || new MessageCenter();

    const {
      loading, dataSource,
      total, selectedRowKeys,
      fetchParams,
      scenes,
      columnsSwitcherSelectedDataIndexes,
      rowKey,
    } = props;

    const activeScene = Array.isArray(scenes)
      ? scenes.find(scene => scene.active) || {}
      : {};

    this.state = {
      loading,
      currentPage: 1,
      dataSource,
      total,
      selectedRowKeys,
      fetchParams: {
        ...fetchParams,
        scene: activeScene.sceneIndex
      },
      headerHeight: 54,
      isShowMoreScenes: false,
      columnsSwitcherSelectedDataIndexes
    };

    this.__rowKeyFn = getRowKeyFn(rowKey);
    this.__registerAPI2Bus();
  }

  __selectedRowData = {};

  __registerAPI2Bus() {
    this.bus.getSelectedRowKeys = () => this.state.selectedRowKeys.slice(0);

    this.bus.clearSelectedRowKeys = () => {
      this.setState({selectedRowKeys: []});
      this.__selectedRowData = {};
    };

    this.bus.reload = (params) => this.fetch(params);
    this.bus.scenesChange = this.handleScenesClick;
    this.bus.getFetchParams = () => clone(this.state.fetchParams);
    this.bus.getSelectedRowData = () => {
      const keys = this.state.selectedRowKeys.slice(0);
      const oo = {};
      keys.forEach(key => oo[key] = this.__selectedRowData[key]);
      return clone(oo);
    };
  }

  componentWillMount() {
    this.bus.on('pagination:changed', this.handlePagination);
    this.bus.on('column:filter', this.handleColumnFilter);
    this.bus.on('column:sort', this.handleColumnSort);
    this.bus.watch('get:column:checked:value', this.handleGetColumnChecked);
  }

  componentDidUpdate() {
    const headerHeight = this.scenesBox &&
      this.scenesBox.children &&
      this.scenesBox.children.length > 0 &&
      this.scenesBox.children[0].offsetHeight || 0;
    if (headerHeight > 54) {
      this.setState({headerHeight});
    }
  }

  componentWillUnmount() {
    this.bus.un('pagination:changed', this.handlePagination);
    this.bus.un('column:filter', this.handleColumnFilter);
    this.bus.un('column:sort', this.handleColumnSort);
    this.bus.un('get:column:checked:value', this.handleGetColumnChecked);
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.dataSource !== nextProps.dataSource) {
      this.setState({
        dataSource: nextProps.dataSource,
        selectedRowKeys: [], //数据源更新 说明当前控件重新渲染了
      });

      this.__selectedRowData = {};
    }

    if (this.props.total !== nextProps.total) {
      this.setState({total: nextProps.total});
    }

    if (this.props.columns !== nextProps.columns) {
      this.setState({columns: mergeOthers2Columns.call(this, nextProps.columns)});
    }

    const {columnsSwitcherSelectedDataIndexes} = nextProps;

    if (!deepEqual(this.props.columnsSwitcherSelectedDataIndexes, columnsSwitcherSelectedDataIndexes)) {
      this.setState({columnsSwitcherSelectedDataIndexes});
    }
  }

  fetch(params) {
    const {fetch} = this.props;
    this.setState({loading: true});
    const {fetchParams} = this.state;
    params = {...fetchParams, ...params};
    return fetch(params).then(data => {
      const {dataSource, total} = data;
      this.setState({
        loading: false,
        fetchParams: params,
        dataSource,
        total,
      });
    });
  }

  handleInputSearch = ({target: {value}}) => {
    const {pageSize} = this.props;
    const oo = {searchText: value};
    if (this.__SEARCHTEXT_IS_OLD) { //当二级条件变更, 清空三级条件
      oo.filters = {};
      oo.sorters = {};
      oo.page = {
        currentPage: 1,
        pageSize
      };
    }

    this.fetch(oo).then(() => {
      this.__SEARCHTEXT_IS_OLD = false;
      this.setState({currentPage: 1});
    });
  };

  handleInputSearchChange = ({target: {value}}) => {
    let {fetchParams} = this.state;
    fetchParams = {...fetchParams, searchText: value};
    this.setState({fetchParams}, () => {
      this.__SEARCHTEXT_IS_OLD = true;
    });
  };

  handleScenesClick = (scene) => {
    const {fetchParams} = this.state;
    const {onSceneChange, pageSize} = this.props;
    onSceneChange && onSceneChange(scene);
    let oo = {scene};
    if (fetchParams.scene !== scene) {
      oo = {
        scene,
        page: {
          currentPage: 1,
          pageSize
        },
        searchText: '',
        sorters: {},
        filters: {},
      };
      this.setState({selectedRowKeys: [], fetchParams: oo, currentPage: 1}); //Scene切换 清空选择的列
      this.handleInputSearchChange({target: {value: ''}});
    }
    this.fetch(oo);
  };

  handleColumnSort = (sorter) => {
    const {columnKey, field, order} = sorter;
    const sorters = {};
    if (columnKey && order) {
      sorters[columnKey] = order;
    }
    this.fetch({sorters});
  };

  handleGetColumnChecked = () => {
    let {columnsSwitcherSelectedDataIndexes} = this.state;
    return columnsSwitcherSelectedDataIndexes;
  };

  handleColumnFilter = (text, columnName) => {
    let {fetchParams} = this.state;
    let {filters, page} = fetchParams;
    filters = {...filters, [columnName]: text};
    page = {...page, currentPage: 1};
    this.fetch({filters, page});
    this.setState({currentPage: 1});
  };

  handlePaginationChanged = (page, pageSize) => {
    this.bus.emit('pagination:changed', page, pageSize);
  };

  handlePagination = (currentPage, pageSize) => {
    this.setState({currentPage});
    this.fetch({page: {currentPage, pageSize}});
  };

  handleSelectChange = (selectedRowKeys, selectedRowData) => {
    this.setState({selectedRowKeys});
    const rowKeyFn = this.__rowKeyFn;
    selectedRowData.forEach(line => {
      this.__selectedRowData[rowKeyFn(line)] = line;
    });
    this.bus.emit('select:change', selectedRowKeys, this.__selectedRowData);
  };

  handleFooterButtonsClick = (meta) => {
    this.bus.emit('buttons:click', meta);
  };

  handleSelectAllBtnClick = () => {
    this.bus.emit('selectAllBtn:click');
  };

  handleColumnsSwitch = (columnsSwitcherSelectedDataIndexes) => {
    this.setState({columnsSwitcherSelectedDataIndexes});
    let {onColumnsSwitcherChange} = this.props;
    onColumnsSwitcherChange && onColumnsSwitcherChange(columnsSwitcherSelectedDataIndexes);
  };

  handleMoreScenesSwitch = () => {
    const {isShowMoreScenes} = this.state;
    this.setState({isShowMoreScenes: !isShowMoreScenes});
  };

  render() {
    const {
      buttons, scenes, columns, noScene,
      isMultiSelect, isButtonsBindMultiSelect,
      searchPlaceholder,
      pageSize,
      menuBarView,
      selectAllBtnStyles,
      onEditScenes,
      scroll,
      active,
      getCheckboxProps,
      renderCustomButtonsLabel,
      disabledHeader,
      disabledSwitcher,
      wrapperStyle,
      wrapperHeaderContentStyle,
      wrapperColumnsSwitcherStyle,
      ...others
    } = this.props;

    const bus = this.bus;

    const {
      dataSource, total, loading,
      selectedRowKeys,
      fetchParams,
      columnsSwitcherSelectedDataIndexes,
      currentPage,
      headerHeight,
      isShowMoreScenes,
    } = this.state;

    const {sorters, searchText} = fetchParams;

    const columns2 = mergeOthers2Columns.call(this, columns, sorters);

    let rowSelection = null;

    if (isMultiSelect) {
      rowSelection = {selectedRowKeys, onChange: this.handleSelectChange};
    }

    if (getCheckboxProps) {
      rowSelection.getCheckboxProps = getCheckboxProps;
    }

    const ColumnsSwitcherTop = isShowMoreScenes ? (headerHeight + 1) : 50;
    const headerContentStyle = isShowMoreScenes ? {height: 'auto', ...wrapperColumnsSwitcherStyle} : wrapperHeaderContentStyle;
    const moreBtnClass = isShowMoreScenes ? 'moreButtonUp' : 'moreButtonDown';
    const fixScroll = isShowMoreScenes ? Object.assign({}, scroll, {y: scroll.y - headerHeight + 49}) : scroll;

    return (
      <div className={styles.dataGridWrapper} style={wrapperStyle}>

        {!disabledSwitcher &&
        <ColumnsSwitcher style={wrapperColumnsSwitcherStyle}
                         top={ColumnsSwitcherTop}
                         bus={bus}
                         dataSource={columns2}
                         selectedDataIndexes={columnsSwitcherSelectedDataIndexes}
                         onChange={this.handleColumnsSwitch}
        />}

        {!disabledHeader &&
        <div className={styles.headerContent} style={headerContentStyle}>
          <div className={styles.scenesBox}
               ref={scenesBox => {this.scenesBox = scenesBox;}}>
            {
              (scenes && scenes.length || onEditScenes) && (
                <Scenes
                  active={active}
                  bus={bus}
                  noScene={noScene}
                  scenes={scenes}
                  onClick={this.handleScenesClick}
                  onEditScenes={onEditScenes}
                />
              )
            }
          </div>
          {
            headerHeight > 54 && (
              <a className={styles[moreBtnClass]}
                 onClick={this.handleMoreScenesSwitch}>
                {isShowMoreScenes ? '收起' : '更多'}
              </a>
            )
          }
          <div className={styles.right}>
            {menuBarView && menuBarView()}
            <div className={styles.search}>
              <SearchInput
                value={searchText}
                placeholder={searchPlaceholder}
                onChange={this.handleInputSearchChange}
                onSearch={(value) => this.handleInputSearch({target: {value}})}
                onClear={() => this.handleInputSearch({target: {value: ''}})}
                onPressEnter={this.handleInputSearch}
              />
            </div>
          </div>
        </div>}

        <div className={styles.tableContent}>
          <TableWrapper
            {...others}
            scroll={fixScroll}
            bus={bus}
            loading={loading}
            dataSource={dataSource}
            columns={columns2}
            showColumnsDataIndexes={columnsSwitcherSelectedDataIndexes}
            rowSelection={rowSelection}
            total={total}
          />
        </div>

        <div className={styles.footerContent}>
          <div className={styles.buttons}>
            <Buttons
              bus={bus}
              isButtonsBindMultiSelect={isButtonsBindMultiSelect}
              onClick={this.handleFooterButtonsClick}
              selected={selectedRowKeys.length}
              total={total}
              buttons={buttons}
              renderCustomButtonsLabel={renderCustomButtonsLabel}
            />
            {
              selectAllBtnStyles && (
                <SelectAllBtn
                  bus={bus}
                  onClick={this.handleSelectAllBtnClick}
                  total={total}
                  data={selectAllBtnStyles}
                />)
            }
          </div>
          <div className={styles.pagination}>
            <Pagination
              total={total}
              defaultPageSize={pageSize}
              current={currentPage}
              onChange={this.handlePaginationChanged}
            />
          </div>
        </div>
      </div>
    );
  }
}

