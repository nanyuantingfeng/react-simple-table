/**************************************************
 * Created by nanyuantingfeng on 15/09/2017 15:05.
 **************************************************/
import React from 'react'
import moment from 'moment'
import numberFormat from 'number-format.js'

export function NullCell() {
  return <span>-</span>
}

export function TextCell(props) {
  const { value } = props

  if (!value) {
    return (<NullCell/>)
  }

  return <span>{value}</span>
}

export function NumberCell(props) {
  const { value } = props

  if (!value && value !== 0) {
    return (<NullCell/>)
  }

  return <span>{value}</span>
}

export function MoneyCell(props) {
  let { value } = props

  if (!value && value !== 0) {
    return (<NullCell/>)
  }

//  value = Number(value).toFixed(2)

  value = numberFormat('#,##0.00', value);

  return <span>{value}</span>
}

export function ShortDateCell(props) {
  let { value } = props
  if (!value) {
    return (<NullCell/>)
  }
  value = moment(value).format('YYYY-MM-DD')
  return <span>{value}</span>
}

export function DateCell(props) {
  let { value, columns = {} } = props
  if (!value) {
    return (<NullCell/>)
  }
  const withTime = columns.property && columns.property.withTime
  const format = withTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'
  value = moment(value).format(format)
  return <span>{value}</span>
}

export function DateRangeCell(props) {
  const { value, columns = {} } = props

  if (!value || (typeof value === 'string' && !value.length)) {
    return (<NullCell/>)
  }

  let start = 0
  let end = 0
  if (Array.isArray(value)) {
    start = value[0]
    end = value[1]
  } else if (typeof value === 'object') {
    start = value.start
    end = value.end
  }

  if (!start || !end) {
    return (<NullCell/>)
  }

  const withTime = columns.property && columns.property.withTime
  const format = withTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'

  start = moment(start).format(format)
  end = moment(end).format(format)

  return <span>{`${start} ~ ${end} `}</span>
}

export function RefCell(props) {
  let { value } = props

  if (!value) {
    return (<NullCell/>)
  }

  if (typeof value === 'object') {
    value = value.name || value.label
  }

  return <span>{value}</span>
}

