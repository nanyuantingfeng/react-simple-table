/**************************************************
 * Created by nanyuantingfeng on 07/09/2017 17:10.
 **************************************************/
import React from 'react'
import { parseMeta2ColumnOthers } from './columnOthers'

const faker = require('faker')

export function createFakeData(page, pageSize) {
  page = page === 0 ? 1 : page
  let oo = []
  let i = page * pageSize
  while (++i <= ((page + 1) * pageSize)) {
    oo.push({
      id: i,
      state: faker.random.words(),
      flowId: {
        id: (i + 7000),
        form: {
          specificationId: faker.random.words(),
          code: faker.random.number(),
          title: faker.random.words(),
          submitterId: faker.random.words(),
          submitDate: faker.date.future(),
          writtenOffMoney: faker.finance.amount(),
          loanDepartment: faker.random.words(),
          loanMoney: faker.finance.amount(),
          loanDate: faker.date.future(),
          datePeriod: [faker.date.future(), faker.date.future()],
          feeDatePeriod: [faker.date.future(), faker.date.future()],
        }
      }
    })
  }
  return oo
}

const all =[ 'F1IDBMWCVW94YFET8',
  'F1IDBMWCWA64YFEB8',
  'F1IDBMWCWLB4YFI38',
  'F1IDBMWCWVC4YFFE3',
  'F1IDBMWCX6C4YFBQ2',
  'F1IDBMWCXHT4YFAYB',
  'F1IDBMWCY5Y4YFG08',
  'F1IDBMWCYVJ4YFH8N',
  'F1IDBMYXVIA4YFHH1',
  'F1IDBMYYAE84YF14I',
  'F1IDBMYYBEW4YFI8N',
  'F1IDBMZ76KJ4YFI3G',
  'F1IDBMWCXU44YFH1W',
  'F1IDBMWCYHL4YFIQQ',
  'F1IDBMWCVKA4YFI1P' ]

const mapper = {all}

const prefixExclude = [
  'state',
  'action',
]

const COLUMN_PROPERTY_MAPPING = {}

function prefix(name, prefixPath) {
  if (!prefixPath || !!~prefixExclude.indexOf(name)) {
    return name
  }
  return `${prefixPath}.${name}`
}

function parseMeta2Column(property, prefixPath) {
  const {name, label, width, dataType} = property
  const {type} = dataType
  const dataIndex = prefix(name, prefixPath)
  const others = parseMeta2ColumnOthers(name, property)
  COLUMN_PROPERTY_MAPPING[dataIndex] = property

  return {
    title: label,
    dataIndex,
    dataType: type,
    filterType: type,
    key: dataIndex,
    sorter: true,
    label,
    width,
    value: dataIndex,
    property,
    ...others,
  }
}

export function createColumns(baseDataProperties = [], prefixPath) {
  return baseDataProperties.map(line => parseMeta2Column(line, prefixPath))
}

export function createColumnsSwitcherDataIndexes(type, prefixPath) {
  const array = mapper[type]
  return array.map(line => prefix(line, prefixPath))
}

export function createActionColumn(bus) {
  return {
    title: '操作',
    width: 200,
    filterType: false,
    dataIndex: 'action',
    key: 'action',
    label: '操作',
    value: 'action',
    className: 'actions-wrapper',
    render(text, line) {
      return (
        <div className="actions" onClick={e => {
          e.nativeEvent.stopImmediatePropagation()
          e.stopPropagation()
          e.preventDefault()
          return false
        }}>
          <a className="ant-dropdown-link mr-16"
             onClick={e => bus.emit('table:row:action', 3 /*'agree'*/, line)}>同意</a>
          <a className="reject mr-16"
             onClick={e => bus.emit('table:row:action', 1 /*'reject'*/, line)}>驳回</a>
          <a className="print"
             onClick={e => bus.emit('table:row:action', 8 /*'print'*/, line)}>打印</a>
        </div>
      )
    }
  }
}

export function getColumnPropertyMapping() {
  return COLUMN_PROPERTY_MAPPING
}


 
