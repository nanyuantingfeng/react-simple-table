/**
 *  Created by panwei on 2018/5/28 下午3:15.
 */
import React, { PureComponent } from 'react'
import styles from '../../styles/EKBDataGrid.module.less'
import Buttons from '../puppet/Buttons'
import SelectAllBtn from '../puppet/SelectAllBtn'

export default class Footer extends PureComponent {

  handleFooterButtonsClick = (meta) => {
    const { bus } = this.props
    bus.emit('buttons:click', meta)
  }

  handleSelectAllBtnClick = () => {
    const { bus } = this.props
    bus.emit('selectAllBtn:click')
  }

  render() {
    const { selectAllBtnStyles } = this.props
    return <div className={styles.footerContent}>
      <div className={styles.buttons}>
        <Buttons {...this.props}
                 onClick={this.handleFooterButtonsClick}/>
        {
          selectAllBtnStyles && (
            <SelectAllBtn {...this.props}
                          onClick={this.handleSelectAllBtnClick}
            />)
        }
      </div>
    </div>
  }
}