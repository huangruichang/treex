
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { CommitFileList, DiffPanel } from '../../components'
import {
  loadUnstagedFiles,
  loadStagedFiles,
  loadDiffLines,
  stageFileLines,
  stageAllFileLines,
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
  }

  componentWillMount() {
    const { store, repo } = this.props
    if (store && repo) {
      store.dispatch(loadUnstagedFiles(repo))
      store.dispatch(loadStagedFiles(repo))
      GLOBAL_REPO = repo
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

  render() {
    let unstagedFileList = this.props.unstagedPatches.length > 0 ?
      <CommitFileList
        commitDiffFiles={this.props.unstagedPatches}
        onItemClick={this.props.onCommitDiffFileClick}
        style={{
          height: 250,
        }}
        mode={'unstaged'}
        onStageClick={this.props.onStageClick}
        onStageAllClick={this.props.onStageAllClick}
      /> : ''
    let stagedFileList = this.props.stagedPatches.length > 0 ?
      <CommitFileList
        commitDiffFiles={this.props.stagedPatches}
        onItemClick={this.props.onCommitDiffFileClick}
        style={{
          height: 250,
        }}
        mode={'staged'}
        onUnStageClick={this.props.onUnStageClick}
        onUnStageAllClick={this.props.onUnStageAllClick}
      /> : ''
    return (
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
          <DiffPanel patches={this.props.diffPatches}/>
        </div>
      </div>
    )
  }
}
