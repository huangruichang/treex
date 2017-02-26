
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CredModal } from '../../components'
import {
  closeFocuseWindow,
  findClonePath,
  clone,
  endValidating,
} from '../../actions'

require('!style!css!sass!../common.scss')
const styles = require('./ClonePage.scss')

const mapStateToProps = (state) => {
  return {
    cloneFilePath: state.repo.cloneFilePath,
    cloneProjectName: state.repo.cloneProjectName,
    progress: state.repo.progress,
    validating: state.repo.validating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCancelClick: () => {
      dispatch(closeFocuseWindow())
    },
    onSubmitClick: (repoUrl, path, userName, password) => {
      dispatch(clone(repoUrl, path, userName, password))
    },
    onFindClick: () => {
      dispatch(findClonePath())
    },
    endValidating: () => {
      dispatch(endValidating())
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
    this.userName = ''
    this.password = ''
  }

  onSubmitClick() {
    this.props.onSubmitClick(this.sourcePath, this.cloneFilePath, this.userName, this.password)
  }

  render() {

    if (!this.cloneFilePath) {
      this.cloneFilePath = this.props.cloneFilePath
      this.cloneProjectName = this.props.cloneProjectName
    }

    let $credModal = this.props.validating?<CredModal
      onConfirmCallback={() => {
        this.props.endValidating()
        this.onSubmitClick()
      }}
      userNameSetter={(userName) => {
        this.userName = userName
      }}
      passwordSetter={(password) => {
        this.password = password
      }}
      onCloseCallback={() => {
        this.props.endValidating()
      }}
    />:''

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
        {$credModal}
      </form>
    )
  }
}
