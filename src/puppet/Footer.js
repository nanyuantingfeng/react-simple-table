/**************************************************
 * Created by nanyuantingfeng on 12/09/2017 18:25.
 **************************************************/
import styles from '../../styles/Footer.module.less'
import React from 'react'

function Footer (props) {
  let {children, onOk, onReset, className} = props
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.body}>
        {children}
      </div>

      <div className={styles.buttons}>
        <a onClick={onOk}>确定</a>
        <a onClick={onReset}>重置</a>
      </div>
    </div>
  )
}

export default Footer
