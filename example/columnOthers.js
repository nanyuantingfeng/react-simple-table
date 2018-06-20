/**************************************************
 * Created by nanyuantingfeng on 21/09/2017 15:08.
 **************************************************/
import React from 'react'

import { NullCell } from '../src/puppet/Cells'
import { Popover } from 'antd'

import {
  isBaseData,
  isCity, isPayeeInfos,
} from './propertySetIs'

const stateMap = {
  draft: {
    color: '#eda85a',
    icon: 'state-draft',
    text: '待提交',
  },
  approving: {
    color: '#48ade7',
    icon: 'state-approval',
    text: '审核中',
  },
  pending: {
    color: '#48ade7',
    icon: 'state-approval',
    text: '提交中',
  },
  paying: {
    color: '#48ade7',
    icon: 'state-approval',
    text: '待支付',
  },
  paid: {
    color: '#a1dc63',
    icon: 'state-paid',
    text: '已完成',
  },
  archived: {
    color: '#a1dc63',
    icon: 'state-paid',
    text: '已完成',
  },
  rejected: {
    color: '#f17b7b',
    icon: 'state-rejected',
    text: '被驳回',
  },
  //todo 第三方平台的支付中状态
  //340 : {
  //  color : '48ade7',
  //  icon : 'state-approval',
  //  text : '支付中'
  //},
}

export function fixEnums (enumSource, filterDataSource) {
  return {
    filterType: 'list',
    filterDataSource: filterDataSource,
    render (text) {
      return (<span>{enumSource[text]}</span>)
    }
  }
}

export function fixBaseData () {
  return {
    render (text, record) {
      if (!text) {
        return <NullCell/>
      }
      const {name, code} = text
      return (<span>{name}({code})</span>)
    }
  }
}

export function fixCity () {
  return {
    render (text, record) {

      if (!text) {
        return <NullCell/>
      }

      const arr = JSON.parse(text)
      const label = arr.map(line => line.label).join(',')
      return (<span>{label}</span>)
    }
  }
}

function renderPayDetail (doc = {}) {
  return <div className="ekb-account-info-popover">
    <div className="header">{doc.type === 'PERSONAL' ? '个人账户' : '对公账户'} | {doc.name}</div>
    <div className="body">
      <div className="line1"><img src={doc.icon}/>{doc.bank}</div>
      <div className="line2">{doc.cardNo}</div>
      <div className="line3">{doc.branch}</div>
    </div>
  </div>
}

export function fixPayeeInfo () {
  return {
    render (payeeInfo) {

      if (!payeeInfo) {
        return <NullCell/>
      }

      return (
        <Popover content={renderPayDetail.call(this, payeeInfo)}>
          <div className="account">
            <div>{payeeInfo.name}</div>
            <div className="color-gray">
              {payeeInfo.type === 'PERSONAL' ? '个人账户' : '对公账户'}
            </div>
          </div>
        </Popover>
      )

    }
  }
}

const BILL_STATUS = ((stateMap) => {
  const oo = {}
  Object.keys(stateMap).forEach(key => {
    oo[key] = stateMap[key].text
  })
  return oo
})(stateMap)

const BILL_STATUS_FILTERS_DATASOURCE = Object.keys(BILL_STATUS)
  .map(key => ({label: BILL_STATUS[key], value: key}))

export function parseMeta2ColumnOthers (name, property) {
  if (name === 'state') {
    return fixEnums(BILL_STATUS, BILL_STATUS_FILTERS_DATASOURCE)
  }

  if (isBaseData(property)) {
    return fixBaseData()
  }

  if (isCity(property)) {
    return fixCity()
  }

  if (isPayeeInfos(property)) {
    return fixPayeeInfo()
  }

}
