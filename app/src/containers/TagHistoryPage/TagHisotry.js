
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { HistoryList, CommitFileList, CommitInfo, DiffPanel } from '../../components'
import {
  initTagHistoryPage,
  loadCommitDiffFiles,
  loadCommitInfo,
  loadDiffLines,
  appendHistories,
  loadAllCommits,
} from '../../actions'

const styles = require('./TagHistoryPage.scss')

let GLOBAL_REPO
let HISTORIES_COUNT = 50
let TAG

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    histories: state.repo.histories,
    commitDiffFiles: state.repo.commitDiffFiles,
    diffPatches: state.repo.diffPatches,
    commitInfo: state.repo.commitInfo,
    tagCommit: state.repo.tagCommit,
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
        tag: TAG,
      }))
    },
    onCommitDiffFileClick: (patch) => {
      dispatch(loadDiffLines(patch))
    },
    loadAllCommits: () => {
      dispatch(loadAllCommits(GLOBAL_REPO))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class TagHistory extends Component {

  constructor(props) {
    super(props)
    this.mountInit = false
  }

  componentWillMount() {
    const { repo, store } = this.props
    if (repo && store && !this.mountInit) {
      const { params } = this.props
      this.mountInit = true
      store.dispatch(initTagHistoryPage(repo, params.tag))
      GLOBAL_REPO = repo
      TAG = params.tag
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo && !this.mountInit) {
      const { repo, store } = nextProps
      const { params } = this.props
      this.mountInit = true
      store.dispatch(initTagHistoryPage(repo, params.tag))
      GLOBAL_REPO = repo
      TAG = params.tag
    }
  }

  showCommittedHistory(commitId) {
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
    return (
      <div className={styles.historyPage} key={`tag-history-page-${this.props.params.tag}`}>
        <HistoryList
          histories={this.props.histories}
          onItemClick={::this.showCommittedHistory}
          onScrollBottom={::this.props.onHistoryScrollBottom}
          prefix={`tag-history-page-${this.props.params.project}-${this.props.params.branch}`}
          tagCommit={this.props.tagCommit}
          tag={this.props.params.tag}
          onLoadAllClick={::this.props.loadAllCommits}
        />
        <div className={styles.detail}>
          <div className={styles.left}>
            {commitFileList}
            {commitInfo}
          </div>
          <div className={styles.right}>
            <DiffPanel patches={this.props.diffPatches}/>
          </div>
        </div>
      </div>
    )
  }

}
