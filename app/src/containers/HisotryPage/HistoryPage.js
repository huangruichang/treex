
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { RESET_DIFF_LINES } from '../../actions'
import {
  initHistories,
  appendHistories,
  loadCommitDiffFiles,
  loadCommitInfo,
  loadDiffLines,
  loadUnstagedFiles,
  loadStagedFiles,
  stageFileLines,
  stageAllFileLines,
} from '../../actions'
import { HistoryList, CommitFileList, CommitInfo, DiffPanel } from '../../components'

let GLOBAL_REPO
let HISTORIES_COUNT = 100

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    histories: state.repo.histories,
    currentCommit: state.repo.historiesCurrentCommit,
    fileModifiedCount: state.repo.fileModifiedCount,
    commitDiffFiles: state.repo.commitDiffFiles,
    commitInfo: state.repo.commitInfo,
    diffPatches: state.repo.diffPatches,
    unstagedPatches: state.repo.unstagedPatches,
    stagedPatches: state.repo.stagedPatches,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onHistoryClick: (commitId) => {
      dispatch(loadCommitDiffFiles(GLOBAL_REPO, commitId))
      dispatch(loadCommitInfo(GLOBAL_REPO, commitId))
    },
    onHistoryScrollBottom: () => {
      dispatch(appendHistories(GLOBAL_REPO, HISTORIES_COUNT += 100))
    },
    onCommitDiffFileClick: (patch) => {
      dispatch(loadDiffLines(patch))
    },
    onUnCommittedHistory: () => {
      dispatch(loadUnstagedFiles(GLOBAL_REPO))
      dispatch(loadStagedFiles(GLOBAL_REPO))
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
export default class HistoryPage extends Component {

  static propTypes = {
    commitInfo: PropTypes.object,
    commitDiffFiles: PropTypes.array,
    histories: PropTypes.array.isRequired,
    onHistoryClick: PropTypes.func.isRequired,
    onHistoryScrollBottom: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.historiesInit = false
    this.commitDiffFilesInit = false
    this.uncommittedHisotryInit = false
    this.uncommittedHisotryDiffFilesInit = false
    this.uncommittedHisotryHidden = false
  }

  componentWillMount() {
    const { repo, store } = this.props
    if (repo && store) {
      store.dispatch(initHistories(repo))
      GLOBAL_REPO = repo
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo) {
      const { repo, store } = nextProps
      store.dispatch(initHistories(repo))
      GLOBAL_REPO = repo
    }

    if (nextProps.fileModifiedCount > 0 && !this.uncommittedHisotryInit) {
      this.uncommittedHisotryInit = true
      const { store } = this.props
      store.dispatch(loadStagedFiles(GLOBAL_REPO))
      store.dispatch(loadUnstagedFiles(GLOBAL_REPO))
      return
    }

    if (this.uncommittedHisotryInit
      && !this.uncommittedHisotryDiffFilesInit
      && (this.props.stagedPatches.length > 0
          || this.props.unstagedPatches.length > 0)) {
      this.uncommittedHisotryDiffFilesInit = true
      this.commitDiffFilesInit = true
      const { store } = this.props
      if (this.props.stagedPatches.length > 0) {
        store.dispatch(loadDiffLines(this.props.stagedPatches[0]))
      } else if (this.props.unstagedPatches.length > 0) {
        store.dispatch(loadDiffLines(this.props.unstagedPatches[0]))
      }
      return
    }

    if (nextProps.histories.length > 0 && !this.historiesInit) {
      this.historiesInit = true
      const { store } = this.props
      const firstHistory = nextProps.histories[0]
      if (this.uncommittedHisotryInit || this.uncommittedHisotryDiffFilesInit) {
        return
      }
      this.uncommittedHisotryHidden = true
      store.dispatch(loadCommitDiffFiles(GLOBAL_REPO, firstHistory.commitId))
      store.dispatch(loadCommitInfo(GLOBAL_REPO, firstHistory.commitId))
      return
    }

    if (nextProps.commitDiffFiles.length > 0 && !this.commitDiffFilesInit) {
      this.commitDiffFilesInit = true
      const { store } = this.props
      const firstCommitDiffFile = nextProps.commitDiffFiles[0]
      store.dispatch(loadDiffLines(firstCommitDiffFile))
    }
  }

  componentWillUnmount() {
    const { store } = this.props
    store.dispatch({
      type: RESET_DIFF_LINES,
      diffPatches: [],
    })
  }

  showUncommittedHistory() {
    this.uncommittedHisotryHidden = false
    this.props.onUnCommittedHistory()
  }

  showCommittedHistory(commitId) {
    this.uncommittedHisotryHidden = true
    this.props.onHistoryClick(commitId)
  }

  render() {
    let commitInfo = this.props.commitInfo?<CommitInfo
      commitId={this.props.commitInfo.commitId}
      desc={this.props.commitInfo.desc}
      author={this.props.commitInfo.author}
      date={this.props.commitInfo.date}
      parents={this.props.commitInfo.parents}
      style={{
        marginTop: 10,
      }}
    />:''
    let commitFileList = this.props.commitDiffFiles.length > 0 ?
      <CommitFileList
        commitDiffFiles={this.props.commitDiffFiles}
        onItemClick={this.props.onCommitDiffFileClick}
        style={{
          marginTop: 10,
        }}
      />:''
    let unstagedFileList = this.props.unstagedPatches.length > 0 ?
      <CommitFileList
        commitDiffFiles={this.props.unstagedPatches}
        onItemClick={this.props.onCommitDiffFileClick}
        mode={'unstaged'}
        onStageClick={this.props.onStageClick}
        onStageAllClick={this.props.onStageAllClick}
      /> : <div style={{ minHeight: 150 }}></div>
    let stagedFileList = this.props.stagedPatches.length > 0 ?
      <CommitFileList
        commitDiffFiles={this.props.stagedPatches}
        onItemClick={this.props.onCommitDiffFileClick}
        mode={'staged'}
        onUnStageClick={this.props.onUnStageClick}
        onUnStageAllClick={this.props.onUnStageAllClick}
      /> : <div style={{ minHeight: 150 }}></div>
    let uppperBox
    let lowerBox
    if (this.uncommittedHisotryHidden) {
      uppperBox = commitFileList
      lowerBox = commitInfo
    } else {
      uppperBox = stagedFileList
      lowerBox = unstagedFileList
    }

    return (
      <div>
        <HistoryList
          histories={this.props.histories}
          onItemClick={::this.showCommittedHistory}
          onScrollBottom={this.props.onHistoryScrollBottom}
          hasUnCommittedHistory={this.props.fileModifiedCount > 0}
          onUnCommittedHistory={::this.showUncommittedHistory}
        />
        <div style={{
          display: 'flex',
        }}>
          <div style={{ width: '50%' }}>
            {uppperBox}
            {lowerBox}
          </div>
          <div style={{
            width: '49%',
            paddingLeft: '1%',
            height: 300,
            overflow: 'auto',
            marginTop: 20,
            fontSize: 12,
          }}>
          <DiffPanel patches={this.props.diffPatches}/>
          </div>
        </div>
      </div>
    )
  }

}
