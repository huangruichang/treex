
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  closeFocuseWindow,
  findClonePath,
  clone,
} from '../../actions'

require('!style!css!sass!../common.scss')
const styles = require('./ClonePage.scss')

const mapStateToProps = (state) => {
  return {
    cloneFilePath: state.repo.cloneFilePath,
    cloneProjectName: state.repo.cloneProjectName,
    progress: state.repo.progress,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCancelClick: () => {
      dispatch(closeFocuseWindow())
    },
    onSubmitClick: (repoUrl, path) => {
      dispatch(clone(repoUrl, path))
    },
    onFindClick: () => {
      dispatch(findClonePath())
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class ClonePage extends Component {

  constructor(props) {
    super(props)
    this.cloneFilePath = ''
    this.cloneProjectName = ''
    this.sourcePath = ''
  }

  onSubmitClick() {
    this.props.onSubmitClick(this.sourcePath, this.cloneFilePath)
  }

  render() {

    if (!this.cloneFilePath) {
      this.cloneFilePath = this.props.cloneFilePath
      this.cloneProjectName = this.props.cloneProjectName
    }

    return (
      <form className={styles.form} onSubmit={() => { return false }}>
        <div className={styles.formGroup}>
          <label className={styles.label} for>源URL:</label>
          <input className={styles.input} type="text" onChange={(e) => {
            this.sourcePath = e.target.value
          }}/>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>目标路径:</label>
          <input className={styles.input} type="text" value={this.cloneFilePath || ''}/>
          <div className={styles.moreButton} onClick={this.props.onFindClick}>...</div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>名称:</label>
          <input className={styles.input} type="text" value={this.cloneProjectName || ''}/>
        </div>
        <div className={styles.formGroup}>
          <div style={{ marginLeft: 115, display: 'inline-block', marginRight: 20 }}>进度:</div>
          <div style={{ display: 'inline-block' }}>{this.props.progress}</div>
        </div>
        <div className={styles.buttonGroup}>
          <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
          <div className={`${styles.button} ${styles.submit}`} onClick={(e) => {
            this.onSubmitClick(e)
          }}>确定</div>
        </div>
      </form>
    )
  }
}
