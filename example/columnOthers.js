/**************************************************
 * Created by nanyuantingfeng on 21/09/2017 15:08.
 **************************************************/
import React from 'react';

import { NullCell } from '../src/puppet/Cells';
import { Popover } from 'antd';

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
};

export function fixEnums(enumSource, filterDataSource) {
  return {
    filterType: 'list',
    filterDataSource: filterDataSource,
    render(text) {
      return (<span>{enumSource[text]}</span>);
    }
  };
}

const BILL_STATUS = ((stateMap) => {
  const oo = {};
  Object.keys(stateMap).forEach(key => {
    oo[key] = stateMap[key].text;
  });
  return oo;
})(stateMap);

const BILL_STATUS_FILTERS_DATASOURCE = Object.keys(BILL_STATUS)
  .map(key => ({label: BILL_STATUS[key], value: key}));

export function parseMeta2ColumnOthers(name, property) {
  if (name === 'state') {
    return fixEnums(BILL_STATUS, BILL_STATUS_FILTERS_DATASOURCE);
  }
}
