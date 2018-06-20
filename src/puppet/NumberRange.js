/**************************************************
 * Created by nanyuantingfeng on 13/09/2017 13:19.
 **************************************************/
import styles from '../../styles/NumberRange.module.less'
import React, { PureComponent } from 'react'
import { InputNumber } from 'antd'
import deepEqual from 'deep-equal'

export default class NumberRange extends PureComponent {

  constructor (props, ...args) {
    super(props, ...args)
    const {start, end} = props.value || {}
    this.state = {start, end}
  }

  componentWillReceiveProps (nextProps) {
    const {value} = nextProps
    if (!deepEqual(this.props.value, value)) {
      const {start, end} = value || {}
      this.setState({start, end})
    }
  }

  handleChangeStart = (value) => {
    this.setState({start: value}, () => {
      let {start, end} = this.state
      const {onChange} = this.props
      onChange && onChange({start, end})
    })
  }

  handleChangeEnd = (value) => {
    this.setState({end: value}, () => {
      let {start, end} = this.state
      const {onChange} = this.props
      onChange && onChange({start, end})
    })
  }

  render () {
    const {start, end} = this.state
    return (
      <div className={styles.wrapper}>
        <InputNumber className={styles.inp}
                     value={start}
                     onChange={this.handleChangeStart}/>
        <span className={styles.sep}>~</span>
        <InputNumber className={styles.inp}
                     value={end}
                     onChange={this.handleChangeEnd}/>
      </div>
    )
  }
}
