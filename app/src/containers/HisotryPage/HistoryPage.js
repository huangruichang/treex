
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { RESET_DIFF_LINES } from '../../actions'
import {
  initHistories,
  appendHistories,
  loadCommitDiffFiles,
  loadCommitInfo,
  loadDiffLines,
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
    if (nextProps.histories.length > 0 && !this.historiesInit) {
      this.historiesInit = true
      const { store } = this.props
      const firstHistory = nextProps.histories[0]
      store.dispatch(loadCommitDiffFiles(GLOBAL_REPO, firstHistory.commitId))
      store.dispatch(loadCommitInfo(GLOBAL_REPO, firstHistory.commitId))
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
    return (
      <div>
        <HistoryList
          histories={this.props.histories}
          onItemClick={this.props.onHistoryClick}
          onScrollBottom={this.props.onHistoryScrollBottom}
        />
        <div style={{
          display: 'flex',
        }}>
          <div style={{ width: '50%' }}>
            {commitFileList}
            {commitInfo}
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
