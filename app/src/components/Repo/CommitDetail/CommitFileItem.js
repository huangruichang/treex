
import React, { Component, PropTypes } from 'react'

export default class CommitFileItem extends Component {

  static propTypes = {
    path: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    patches: PropTypes.object.isRequired,
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div onClick={() => { this.props.onClick(this.props.patches) }}
           style={this.props.style}>
        <div>{this.props.path}</div>
      </div>
    )
  }

}
