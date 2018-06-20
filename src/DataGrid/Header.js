/**
 *  Created by panwei on 2018/5/28 下午3:15.
 */
import React, { PureComponent } from 'react'
import styles from '../../styles/EKBDataGrid.module.less'
// import Scenes from '../puppet/Scenes'
import Scenes from './Scenes'
import SearchInput from '../puppet/SearchInput'
import EKBPagination from './EKBPagination'
// import Buttons from '../puppet/Buttons'
import Buttons from './Buttons'

export default class Header extends PureComponent {

  scenesBox = null

  constructor(props, ...args) {
    super(props, ...args)
    const {
            dataSource,
            total, selectedRowKeys,
            fetchParams,
            scenes,
            columnsSwitcherSelectedDataIndexes,
          } = props
    const activeScene = Array.isArray(scenes)
      ? scenes.find(scene => scene.active) || {}
      : {}
    this.state = {
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
    }
  }

  componentWillReceiveProps(nextPorps) {
    if (this.props.fetchParams !== nextPorps.fetchParams) {
      this.setState({ fetchParams: nextPorps.fetchParams })
    }
  }

  componentDidUpdate() {
    const headerHeight = this.scenesBox &&
                         this.scenesBox.children &&
                         this.scenesBox.children.length > 0 &&
                         this.scenesBox.children[0].offsetHeight || 0
    if (headerHeight > 54) {
      const { onHeaderHeightChanged } = this.props
      onHeaderHeightChanged && onHeaderHeightChanged(headerHeight)
      this.setState({ headerHeight })
    }
  }

  handleScenesClick = (scene) => {
    const { fetchParams } = this.state
    const { onSceneChange, pageSize, bus } = this.props
    onSceneChange && onSceneChange(scene)
    let oo = { scene }
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
      }
      this.setState({ selectedRowKeys: [], fetchParams: oo, currentPage: 1 }) //Scene切换 清空选择的列
      this.handleInputSearchChange({ target: { value: '' } })
    }
    bus.emit('dataGrid:fetch:data', oo)
  }

  handleMoreScenesSwitch = () => {
    const { onShowMoreSence } = this.props
    const { isShowMoreScenes } = this.state
    onShowMoreSence && onShowMoreSence(!isShowMoreScenes)
    this.setState({ isShowMoreScenes: !isShowMoreScenes })
  }

  handleInputSearch = ({ target: { value } }) => {
    const { pageSize, bus } = this.props
    const oo = { searchText: value }
    if (this.__SEARCHTEXT_IS_OLD) { //当二级条件变更, 清空三级条件
      oo.filters = {}
      oo.sorters = {}
      oo.page = {
        currentPage: 1,
        pageSize
      }
    }

    bus.invoke('dataGrid:fetch:data', oo).then(() => {
      this.__SEARCHTEXT_IS_OLD = false
      this.setState({ currentPage: 1 })
    })
  }

  handleInputSearchChange = ({ target: { value } }) => {
    let { fetchParams } = this.state
    fetchParams = { ...fetchParams, searchText: value }
    this.setState({ fetchParams }, () => {
      this.__SEARCHTEXT_IS_OLD = true
    })
  }

  handlePaginationChanged = (page, pageSize) => {
    const { bus } = this.props
    this.setState({ currentPage: page })
    bus.emit('pagination:changed', page, pageSize)
  }

  handlePageSizeChanged = (current, size) => {

  }

  handleButtonsClick = (meta) => {
    const { bus } = this.props
    bus.emit('buttons:click', meta)
  }

  render() {
    const {
            scenes,
            noScene,
            searchPlaceholder,
            menuBarView,
            onEditScenes,
            active,
            disabledHeader,
            bus,
            wrapperHeaderContentStyle,
            wrapperColumnsSwitcherStyle,
            buttons,
          } = this.props

    if (disabledHeader) return null

    const {
            fetchParams,
            isShowMoreScenes,
            currentPage,
          } = this.state
    const { searchText } = fetchParams
    const headerContentStyle = isShowMoreScenes ? { height: 'auto', ...wrapperColumnsSwitcherStyle }
      : wrapperHeaderContentStyle
    const isShowSence = scenes && scenes.length || onEditScenes

    return <div className={styles.headerContent} style={headerContentStyle}>
      <div className={styles.left}>
        <div className={styles.left_header}>
          {
            isShowSence && (
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
          <div className={styles.search}>
            <SearchInput
              value={searchText}
              placeholder={searchPlaceholder}
              onChange={this.handleInputSearchChange}
              onSearch={(value) => this.handleInputSearch({ target: { value } })}
              onClear={() => this.handleInputSearch({ target: { value: '' } })}
              onPressEnter={this.handleInputSearch}
            />
          </div>
          {menuBarView && menuBarView()}
        </div>
        {buttons && buttons.length && <div className={styles.buttons}>
          <Buttons {...this.props}
                   onClick={this.handleButtonsClick}/>
        </div>}
      </div>

      <div className={styles.right}>
        <EKBPagination
          {...this.props}
          currentPage={currentPage}
          onPageChanged={this.handlePaginationChanged}
          onPageSizeChanged={this.handlePageSizeChanged}/>
      </div>
    </div>
  }
}