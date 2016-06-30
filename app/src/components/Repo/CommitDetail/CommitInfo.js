
import React, { Component, PropTypes } from 'react'

const styles = require('./CommitDetail.scss')

export default class CommitInfo extends Component {

  static propTypes = {
    commitId: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    parents: PropTypes.array.isRequired,
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.commitInfo} style={this.props.style}>
        <div>
          <span>提交:</span>
          <span>{this.props.commitId}</span>
        </div>
        <div>
          <span>父级:</span>
          {this.props.parents.map((obj, index) => {
            return <span key={`commit-diff-file-parent-${index}`}>{obj}</span>
          })}
        </div>
        <div>
          <span>作者:</span>
          <span>{this.props.author}</span>
        </div>
        <div>
          <span>日期:</span>
          <span>{this.props.date}</span>
        </div>
      </div>
    )
  }
}
