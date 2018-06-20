/**************************************************
 * Created by nanyuantingfeng on 07/09/2017 17:10.
 **************************************************/
import React from 'react';
import { parseMeta2ColumnOthers } from './columnOthers';

const faker = require('faker');

export function createFakeData(page, pageSize) {
  page = page === 0 ? 1 : page;
  let oo = [];
  let i = page * pageSize;
  while (++i <= ((page + 1) * pageSize)) {
    oo.push({
      id: i,
      a: faker.random.words(),
      b: faker.random.words(),
      c: faker.random.number(),
      d: faker.random.words(),
      e: faker.random.words(),
      f: faker.date.future(),
      g: faker.finance.amount(),
      h: faker.random.words(),
      i: faker.date.future(),
    });
  }
  return {count: 200, items: oo};
}

const all = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
];

const mapper = {all};

const prefixExclude = [
  'state',
  'action',
];

function prefix(name, prefixPath) {
  if (!prefixPath || !!~prefixExclude.indexOf(name)) {
    return name;
  }
  return `${prefixPath}.${name}`;
}

function parseMeta2Column(property, prefixPath) {
  const {name, label, width, dataType} = property;
  const {type} = dataType;
  const dataIndex = prefix(name, prefixPath);
  const others = parseMeta2ColumnOthers(name, property);

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
  };
}

export function createColumns(baseDataProperties = [], prefixPath) {
  return baseDataProperties.map(line => parseMeta2Column(line, prefixPath));
}

export function createColumnsSwitcherDataIndexes(type, prefixPath) {
  const array = mapper[type];
  return array.map(line => prefix(line, prefixPath));
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
          e.nativeEvent.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();
          return false;
        }}>
          <a className="ant-dropdown-link mr-16"
             onClick={e => bus.emit('table:row:action', 3 /*'agree'*/, line)}>同意</a>
          <a className="reject mr-16"
             onClick={e => bus.emit('table:row:action', 1 /*'reject'*/, line)}>驳回</a>
          <a className="print"
             onClick={e => bus.emit('table:row:action', 8 /*'print'*/, line)}>打印</a>
        </div>
      );
    }
  };
}



