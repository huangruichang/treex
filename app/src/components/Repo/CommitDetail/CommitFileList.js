
import React, { Component, PropTypes } from 'react'
import CommitFileItem from './CommitFileItem'

const styles = require('./commitDetail.scss')

export default class CommitFileList extends Component {

  static propTypes = {
    commitDiffFiles: PropTypes.array.isRequired,
    onItemClick: PropTypes.func.isRequired,
    mode: PropTypes.string,
    style: PropTypes.object,
    onStageClick: PropTypes.func,
    onUnStageClick: PropTypes.func,
    onStageAllClick: PropTypes.func,
    onUnStageAllClick: PropTypes.func,
  }

  constructor(props) {
    super(props)
  }

  render() {
    let boxHeader = <div>
                        <input type="checkbox" defaultChecked="checked"
                        onChange={() => {this.props.onUnStageAllClick(this.props.commitDiffFiles)}}/>
                      已暂存文件
                    </div>
    if (this.props.mode === 'unstaged') {
      boxHeader = <div>
                    <input type="checkbox"
                    onChange={() => {this.props.onStageAllClick(this.props.commitDiffFiles)}}/>
                    未暂存文件
                  </div>
    }
    return (
      <div className={styles.commitFileList} style={this.props.style}>
        {this.props.mode ? boxHeader : ''}
        {this.props.commitDiffFiles.map((obj, index) => {
          return <CommitFileItem
                    onClick={this.props.onItemClick}
                    path={obj.oldFile().path()}
                    key={`commit-diff-file-${index}`}
                    patches={obj}
                    style={{ marginTop: -1 }}
                    mode={this.props.mode}
                    onStageClick={this.props.onStageClick}
                    onUnStageClick={this.props.onUnStageClick}
                />
        })}
      </div>
    )
  }

}
