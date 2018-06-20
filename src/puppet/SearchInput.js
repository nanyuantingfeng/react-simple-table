/**************************************************
 * Created by nanyuantingfeng on 29/09/2017 17:01.
 **************************************************/
import styles from '../../styles/SearchInput.module.less'
import React, { PureComponent } from 'react'
import { Input, Icon } from 'antd'

export default class SearchInput extends PureComponent {

  constructor (props, ...args) {
    super(props, ...args)
    this.state = {
      value: props.value || '',
      focus: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const {value} = nextProps
    if (this.props.value !== value) {
      this.setState({value: value || ''})
    }
  }

  handleInputChange = (e) => {
    this.setState({value: e.target.value,})
    const {onChange} = this.props
    onChange && onChange(e)
  }

  handleFocusBlur = (e) => {
    this.setState({focus: e.target === document.activeElement,})
  }

  handleSearch = () => {
    const {onSearch} = this.props
    onSearch && onSearch(this.state.value)
  }

  handleClear = () => {
    this.setState({value: ''})
    const {onChange, onClear} = this.props
    onChange && onChange({target: {value: ''}})
    onClear && onClear()
  }

  render () {
    const {
      style,
      className,
      size,
      onSearch,
      onClear,
      ...others
    } = this.props
    const {value} = this.state

    return (
      <div className={`ant-search-input-wrapper ${styles.searchInput} ${className}`}
           style={style}>
        <Input.Search {...others}
                      value={value}
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocusBlur}
                      onBlur={this.handleFocusBlur}
                      onPressEnter={this.handleSearch}
                      onSearch={this.handleSearch}
        />
        <div className={`${styles.clear} ${!this.state.value ? styles.hidden : ''}`}
             onClick={this.handleClear}><Icon type="cross-circle-o"/>
        </div>
      </div>
    )
  }
}
