
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { CommitFileList, DiffPanel, CommitForm } from '../../components'
import {
  loadUnstagedFiles,
  loadStagedFiles,
  loadDiffLines,
  stageFileLines,
  stageAllFileLines,
  loadUser,
  createCommitOnHead,
  RESET_DIFF_LINES,
} from '../../actions'

require('!style!css!sass!../common.scss')
const styles = require('./FileState.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    unstagedPatches: state.repo.unstagedPatches,
    stagedPatches: state.repo.stagedPatches,
    diffPatches: state.repo.diffPatches,
    user: state.project.user,
  }
}

let GLOBAL_REPO

const mapDispatchToProps = (dispatch) => {
  return {
    onCommitDiffFileClick: (patch) => {
      dispatch(loadDiffLines(patch))
    },
    onStageClick: (patch) => {
      dispatch(stageFileLines(GLOBAL_REPO, patch, false))
    },
    onUnStageClick: (patch) => {
      dispatch(stageFileLines(GLOBAL_REPO, patch, true))
    },
    onStageAllClick: (patches) => {
      dispatch(stageAllFileLines(GLOBAL_REPO, patches, false))
    },
    onUnStageAllClick: (patches) => {
      dispatch(stageAllFileLines(GLOBAL_REPO, patches, true))
    },
    onSubmitClick: (commitMessage, user, callback) => {
      dispatch(createCommitOnHead({
        repo: GLOBAL_REPO,
        commitMessage,
        author: user,
        callback: callback,
      }))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class FileStatePage extends Component {

  static propTypes = {
    store: PropTypes.object,
    repo: PropTypes.object,
    unstagedPatches: PropTypes.array,
    stagedPatches: PropTypes.array,
    diffPatches: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.diffPanelInit = false
    this.showCommitForm = false
    this.committing = false
  }

  componentWillMount() {
    const { store, repo } = this.props
    if (store && repo) {
      store.dispatch(loadUnstagedFiles(repo))
      store.dispatch(loadStagedFiles(repo))
      GLOBAL_REPO = repo
    }
    store.dispatch(loadUser())

  }

  componentDidMount() {
    const { params } = this.props
    if (params && params.action === 'commit') {
      this.onCommitInputFocus()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo) {
      const { repo, store } = nextProps
      store.dispatch(loadUnstagedFiles(repo))
      store.dispatch(loadStagedFiles(repo))
      GLOBAL_REPO = repo
    }
    if (!this.diffPanelInit && (nextProps.unstagedPatches.length > 0 || nextProps.stagedPatches.length > 0)) {
      this.diffPanelInit = true
      const { store } = this.props
      if (nextProps.unstagedPatches.length > 0) {
        store.dispatch(loadDiffLines(nextProps.unstagedPatches[0]))
      } else if (nextProps.stagedPatches.length > 0) {
        store.dispatch(loadDiffLines(nextProps.stagedPatches[0]))
      }
    }
  }

  componentWillUnmount() {
    const { store } = this.props
    store.dispatch({
      type: RESET_DIFF_LINES,
      diffPatches: [],
    })
  }

  onCommitInputFocus() {
    this.showCommitForm = true
    this.forceUpdate()

    //shit
    setTimeout(() => {
      document.getElementsByTagName('textarea')[0].focus()
    }, 100)
  }

  onSubmitClick(commitMessage) {
    if (!commitMessage || this.committing) {
      return
    }
    this.committing = true
    let thiz = this
    this.props.onSubmitClick(commitMessage, this.props.user, () => {
      thiz.committing = false
      alert('提交成功')
      thiz.showCommitForm = false
      thiz.forceUpdate()
      //shit
      setTimeout(() => {
        document.getElementsByTagName('textarea')[0].value = ''
      }, 100)
    })
  }

  onCancelClick() {
    this.showCommitForm = false
    this.forceUpdate()
  }

  render() {
    let unstagedFileList = <CommitFileList
        commitDiffFiles={this.props.unstagedPatches || []}
        onItemClick={this.props.onCommitDiffFileClick}
        style={{
          height: 230,
        }}
        mode={'unstaged'}
        onStageClick={this.props.onStageClick}
        onStageAllClick={this.props.onStageAllClick}
      />
    let stagedFileList = <CommitFileList
        commitDiffFiles={this.props.stagedPatches || []}
        onItemClick={this.props.onCommitDiffFileClick}
        style={{
          height: 230,
        }}
        mode={'staged'}
        onUnStageClick={this.props.onUnStageClick}
        onUnStageAllClick={this.props.onUnStageAllClick}
      />
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.leftPart}>
            <div className={styles.upper}>
              {stagedFileList}
            </div>
            <div className={styles.lower}>
              {unstagedFileList}
            </div>
          </div>
          <div className={styles.rightPart}>
            <DiffPanel patches={ this.props.diffPatches }/>
          </div>
          <div className={styles.bottom}>
            <div style={{ width: '96%', margin: 'auto', padding: '6px 0', display: this.showCommitForm? 'none' : 'block'  }}>
              <input placeholder={'提交信息'}
                     style={{ width: '99%', outline: 'none', height: 24, paddingLeft: '1%' }}
                     onFocus={::this.onCommitInputFocus}/>
            </div>
            <div style={{ display: this.showCommitForm? 'block' : 'none', height: 100 }}>
              <CommitForm ref="commifForm"
                onSubmitClick={::this.onSubmitClick}
                onCancelClick={::this.onCancelClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
