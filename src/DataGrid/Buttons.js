/**
 *  Created by daiwenjuan on 2018/5/31 上午11:13.
 */
import React, { PureComponent } from 'react'
import { Button, Dropdown, Menu, Icon } from 'antd'
import styles from '../../styles/Buttons.module.less'

export default class Buttons extends PureComponent {

  static defaultProps = {
    selected: 0,
    total: 0,
    buttons: [],
  }

  handleMenuClick = (e) => {
    let { onClick } = this.props
    onClick && onClick(e.key)
  }

  renderButton = ({ line, isButtonsBindMultiSelect, total, selected, onClick, index, primary }) => {
    const {
            text, className, isActive,
            isBindMultiSelect = isButtonsBindMultiSelect,
            isBindTotal,
            ...others
          } = line

    let disabled = false
    if (isBindMultiSelect) {
      disabled = isActive ? !isActive : selected === 0
    }
    if (isBindTotal && !total) {
      disabled = true
    }
    const clsssName = primary === 'primary' ? styles.button_primary : styles.ekb_buttons
    return (
      <Button key={index} onClick={() => onClick(line)}
              disabled={disabled}
              className={`${clsssName} ${className}`}
              {...others}>
        {text}
      </Button>
    )
  }

  renderPrimaryButton = () => {
    const { buttons, selected, onClick, total, isButtonsBindMultiSelect } = this.props
    const primary = 'primary'
    const primaryButtons = buttons.filter(button => button.type === primary)
    return primaryButtons.map((line, index) => {
      return this.renderButton({ line, isButtonsBindMultiSelect, total, selected, onClick, index, primary })
    })
  }

  renderMoreButton = () => {
    const { buttons, selected, onClick, total, isButtonsBindMultiSelect, showMoreButtonCount = 2 } = this.props
    const _buttons = buttons.filter(button => button.type !== 'primary')
    const showButtons = _buttons.slice(0, showMoreButtonCount)
    const moreButtons = _buttons.slice(showMoreButtonCount)
    const menu = (<Menu onClick={this.handleMenuClick}>
      {moreButtons.map((line, index) => {
        const {
                isActive,
                isBindMultiSelect = isButtonsBindMultiSelect,
                isBindTotal,
              } = line
        let disabled = false
        if (isBindMultiSelect) {
          disabled = isActive ? !isActive : selected === 0
        }
        if (isBindTotal && !total) {
          disabled = true
        }
        return <Menu.Item key={index}
                          disabled={disabled}>
          <span onClick={() => onClick(line)}>{line.text}</span>
        </Menu.Item>
      })}
    </Menu>)
    return <Button.Group>
      {showButtons.map((line, index) => {
        return this.renderButton({ line, isButtonsBindMultiSelect, total, selected, onClick, index })
      })}
      <Dropdown overlay={menu}>
        <Button>
          更多 <Icon type="down"/>
        </Button>
      </Dropdown>
    </Button.Group>
  }

  renderButtons = () => {
    const { buttons, selected, onClick, total, isButtonsBindMultiSelect, showMoreButtonCount = 3 } = this.props
    const showMoreButton = buttons.length > showMoreButtonCount
    const _buttons = buttons.filter(button => button.type !== 'primary')
    if (showMoreButton) {
      return this.renderMoreButton()
    } else {
      return <Button.Group>
        {_buttons.map((line, index) => {
          return this.renderButton({ line, isButtonsBindMultiSelect, total, selected, onClick, index })
        })}
      </Button.Group>
    }
  }

  render() {
    return <div className={styles.button_wrapper}>
      {this.renderPrimaryButton()}
      {this.renderButtons()}
    </div>
  }
}