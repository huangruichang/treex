
import React, { Component, PropTypes } from 'react'

export default class History extends Component {

  static propTypes = {
    commitId: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <span>{this.props.desc}</span>
        <span>{this.props.commitId}</span>
        <span>{this.props.author}</span>
        <span>{this.props.date}</span>
      </div>
    )
  }
}
