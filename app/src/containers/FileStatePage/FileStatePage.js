
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Sidebar } from '../../components'

require('!style!css!sass!../common.scss')

export default class FileStatePage extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div>
          FileStatePage
        </div>
      </div>
    )
  }
}
