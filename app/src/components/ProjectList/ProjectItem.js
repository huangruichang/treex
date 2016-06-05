
import React, { Component, PropTypes } from 'react'

export default class ProjectItem extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div onClick={this.props.onClick}>
        <div>{ this.props.name }</div>
      </div>
    )
  }
}
