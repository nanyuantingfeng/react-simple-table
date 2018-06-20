/**************************************************
 * Created by nanyuantingfeng on 12/09/2017 12:59.
 **************************************************/
import styles from '../../styles/Buttons.module.less'
import React, { PureComponent } from 'react'
import { Button } from 'antd'

export default class Buttons extends PureComponent {

  static defaultProps = {
    selected: 0,
    total: 0,
    buttons: [],
  }

  renderButtons() {
    const { buttons, selected, onClick, total, isButtonsBindMultiSelect } = this.props
    return buttons.map((line, i) => {
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

      return (
        <Button key={i} onClick={() => onClick(line)}
                disabled={disabled}
                className={`${styles.buttons} ${className}`}
                {...others}>
          {text}
        </Button>
      )
    })
  }

  renderSelectionLabel() {
    const { total, selected } = this.props
    return <span className={styles.label}> 已选择 {selected}/{total} 张 </span>
  }

  render() {
    const { buttons, renderCustomButtonsLabel, total, selected } = this.props

    if (buttons.length === 0) {
      return null
    }

    return (
      <div className={styles['horizontal']}>
        {this.renderButtons()}
        {renderCustomButtonsLabel ? renderCustomButtonsLabel(total, selected)
          : this.renderSelectionLabel()}
      </div>
    )
  }
}
