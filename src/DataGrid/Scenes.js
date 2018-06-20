/**
 *  Created by panwei on 2018/5/30 下午6:01.
 */
import React, { PureComponent } from 'react'
import { Dropdown, Icon, Menu } from 'antd'
import styles from '../../styles/Scenes.module.less'

export default class Scenes extends PureComponent {

  static defaultProps = {
    scenes: [],
  }

  state = { selectItem: {} }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      const { active, scenes } = nextProps
      const selectItem = scenes.find(item => item.sceneIndex === active)
      this.setState({ active: nextProps.active, selectItem })
    }
  }

  handClick = (scene) => {
    const { onClick, bus } = this.props
    const { selectItem } = this.state

    if (selectItem.sceneIndex === scene.sceneIndex) { return }

    // @scene: new, @active: old
    bus.emit('scene:changed', scene.sceneIndex, selectItem.sceneIndex)
    this.setState({ selectItem: scene })
    onClick(scene.sceneIndex)
  }

  handleEditScenes() {
    const { onEditScenes } = this.props
    onEditScenes && onEditScenes()
  }

  renderScenes() {
    const { scenes } = this.props

    if (!scenes || !scenes.length) { return null }

    return <Menu className={styles.menu_wrapper}>
      {scenes.map((line, index) => {

        const { text, sceneIndex } = line
        return (
          <Menu.Item key={`${index}:${sceneIndex}`}>
            <a className={styles.scence_item}
               onClick={() => this.handClick(line)}
            >
              {text}
            </a>
          </Menu.Item>
        )
      })}
      <Menu.Divider/>
      <Menu.Item>
        <div className={styles.scence_item_edit}
             onClick={() => this.handleEditScenes()}>
          编辑
        </div>
      </Menu.Item>
    </Menu>

  }

  render() {
    const { selectItem } = this.state
    const label = selectItem.text ? selectItem.text : '全部'
    const menu = this.renderScenes()
    return (
      <Dropdown overlay={menu}>
        <div className={styles.scence_title_wrapper}>
          <label className={styles.scence_title}>{label}</label>
          <Icon type="down"/>
        </div>
      </Dropdown>
    )
  }
}