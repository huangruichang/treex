
import React, { Component, PropTypes } from 'react'
import CommitFileItem from './CommitFileItem'

const styles = require('./commitDetail.scss')

export default class CommitFileList extends Component {

  static propTypes = {
    commitDiffFiles: PropTypes.array.isRequired,
    onItemClick: PropTypes.func.isRequired,
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.commitFileList} style={this.props.style}>
        {this.props.commitDiffFiles.map((obj, index) => {
          return <CommitFileItem
                    onClick={this.props.onItemClick}
                    path={obj.oldFile().path()} key={`commit-diff-file-${index}`}
                    patches={obj}
                    style={{ marginTop: -1 }}
                />
        })}
      </div>
    )
  }

}
