
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { RESET_DIFF_LINES } from '../../actions'
import {
  initHistoryPage,
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
let HISTORIES_COUNT = 50

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
      dispatch(appendHistories({
        repo: GLOBAL_REPO,
        historiesLimit: HISTORIES_COUNT += 50,
      }))
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
    this.mountInit = false
    this.uncommittedHisotryInit = false
    this.uncommittedHisotryHidden = false
  }

  componentWillMount() {
    const { repo, store } = this.props
    if (repo && store && !this.mountInit) {
      const { params } = this.props
      this.mountInit = true
      store.dispatch(initHistoryPage(repo, params.branch))
      GLOBAL_REPO = repo
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo && !this.mountInit) {
      const { repo, store } = nextProps
      const { params } = this.props
      this.mountInit = true
      store.dispatch(initHistoryPage(repo, params.branch))
      GLOBAL_REPO = repo
      return
    }

    if (nextProps.stagedPatches && nextProps.unstagedPatches && !this.uncommittedHisotryInit && this.mountInit) {
      let { stagedPatches, unstagedPatches } = nextProps
      if ((stagedPatches.length > 0 || unstagedPatches.length > 0)) {
        this.uncommittedHisotryHidden = false
        this.uncommittedHisotryInit = true
      } else {
        if (!this.uncommittedHisotryInit) {
          this.uncommittedHisotryHidden = true
          this.uncommittedHisotryInit = true
        }
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
          prefix={`history-page-${this.props.params.project}-${this.props.params.branch}`}
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
