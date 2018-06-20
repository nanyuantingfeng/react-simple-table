/**************************************************
 * Created by nanyuantingfeng on 07/09/2017 14:28.
 **************************************************/
import './app.less'
import React from 'react'
import { render } from 'react-dom'

function onWindowLoad (callback) {
  if (document.readyState === 'complete') {
    return callback()
  }
  window.addEventListener('DOMContentLoaded', callback)
}

export default function (Entry) {
  onWindowLoad(() => {
    let el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)
    render(<Entry/>, el)
  })
}
