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
      state: 'draft',
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

const all = [
  'title',
  'code',
  'specificationId',
  'submitDate',
  'submitterId',
  'state',
  'amount',
  'action',
]

const expense = [
  'title',
  'code',
  'specificationId',
  'expenseDate',
  'submitterId',
  'expenseDepartment',
  'state',
  'expenseMoney',
  'action',
]

const loan = [
  'title',
  'code',
  'specificationId',
  'loanDate',
  'submitterId',
  'loanDepartment',
  'state',
  'loanMoney',
  'action',
]

const requisition = [
  'title',
  'code',
  'specificationId',
  'requisitionDate',
  'submitterId',
  'requisitionDepartment',
  'state',
  'requisitionMoney',
  'action',
]

const mapper = { all, expense, loan, requisition, }

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
  const { name, label, dataType } = property
  const { type } = dataType
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
    value: dataIndex,
    property,
    ...others,
  }
}

export function createColumns(baseDataProperties = [], prefixPath) {
  return baseDataProperties.map(line => parseMeta2Column(line, prefixPath))
}

export function createFixedColumns(baseDataProperties = [], prefixPath, fixedColumns = {}) {
  return baseDataProperties.map((line, index) => {
    const fixedColumnKeys = Object.keys(fixedColumns)
    let column = parseMeta2Column(line, prefixPath)
    if (!!~fixedColumnKeys.indexOf(column.dataIndex)) {
      column.fixed = fixedColumns[column.dataIndex]
    }
    column.width = 200
    return column
  })
}

export function createColumnsSwitcherDataIndexes(type, prefixPath) {
  const array = mapper[type] || mapper['all']
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
    fixed: 'right',
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


 
