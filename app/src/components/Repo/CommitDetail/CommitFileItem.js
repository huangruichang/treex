
import React, { Component, PropTypes } from 'react'

const styles = require('./commitDetail.scss')

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

  getIcon(convenientPath) {
    if (convenientPath.isAdded()) {
      return '+'
    }
    if (convenientPath.isDeleted()) {
      return '-'
    }
    return '...'
  }

  render() {

    this.getIcon(this.props.patches)

    return (
      <div tabIndex={-1} className={ styles.commitFileItem } onClick={() => { this.props.onClick(this.props.patches) }}
           style={this.props.style}>
        <div>
          <div className={ styles.icon }>{this.getIcon(this.props.patches)}</div>
          {this.props.path}
        </div>
      </div>
    )
  }

}
