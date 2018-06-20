/**
 *  Created by panwei on 2018/5/28 下午9:32.
 */
import React from 'react'
import App from './app'
import DEMO from './demo2'

App(function MO(props) {
  return (
    <DEMO {...props} />
  )
})