
import React, { Component, PropTypes } from 'react'

const styles = require('./commitDetail.scss')

export default class CommitFileItem extends Component {

  static propTypes = {
    path: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    patches: PropTypes.object.isRequired,
    mode: PropTypes.string,
    style: PropTypes.object,
    onStageClick: PropTypes.func,
    onUnStageClick: PropTypes.func,
  }

  constructor(props) {
    super(props)
  }

  getIcon(convenientPatch) {
    if (convenientPatch.isAdded()) {
      return '+'
    }
    if (convenientPatch.isDeleted()) {
      return '-'
    }
    return '...'
  }

  render() {
    let checkbox = <input type="checkbox" key={`commit-file-item-checkbox-${this.props.path}`} defaultChecked="checked" onChange={(event) => {
      event.preventDefault()
      event.stopPropagation()
      this.props.onUnStageClick(this.props.patches)
    }}/>
    if (this.props.mode === 'unstaged') {
      checkbox = <input type="checkbox" key={`commit-file-item-checkbox-${this.props.path}`} onChange={() => {
        event.preventDefault()
        event.stopPropagation()
        this.props.onStageClick(this.props.patches)
      }}/>
    }
    this.getIcon(this.props.patches)
    return (
      <div tabIndex={-1} className={ styles.commitFileItem } onClick={() => { this.props.onClick(this.props.patches) }}
           style={this.props.style}>
        <div>
          {this.props.mode ? checkbox : ''}
          <div className={ styles.icon }>{this.getIcon(this.props.patches)}</div>
          {this.props.path}
        </div>
      </div>
    )
  }

}
