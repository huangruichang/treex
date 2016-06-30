
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { HistoryList, SideBar, CommitFileList, CommitInfo, DiffPanel } from '../../components'
import {
  loadRepo,
  initHistories,
  initSideBar,
  loadCommitDiffFiles,
  loadCommitInfo,
  loadDiffLines,
} from '../../actions'

const styles = require('./Repo.scss')
let GLOBAL_REPO

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    histories: state.repo.histories,
    headCommit: state.repo.historiesHeadCommit,
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
    onCommitDiffFileClick: (patch) => {
      dispatch(loadDiffLines(patch))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Repo extends Component {

  static propTypes = {
    store: PropTypes.object,
    onHistoryClick: PropTypes.func,
  }

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo) {
      const { repo, store } = nextProps
      store.dispatch(initHistories(repo))
      store.dispatch(initSideBar(repo))
      GLOBAL_REPO = repo
    }
    if (this.props.histories.length != nextProps.histories.length) {
      // const { headCommit, currentCommit } = nextProps
    }
  }

  componentWillMount() {
    const { store, params } = this.props
    store.dispatch(loadRepo(params.project))
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
    let commitFileList =this.props.commitDiffFiles.length > 0 ?
      <CommitFileList
        commitDiffFiles={this.props.commitDiffFiles}
        onItemClick={this.props.onCommitDiffFileClick}
        style={{
          marginTop: 10,
        }}
      />:''
    return (
      <div className={styles.repo}>
        <div className={styles.panelLeft}>
          <SideBar fileModifiedCount={this.props.fileModifiedCount}/>
        </div>
        <div className={styles.panelRight}>
          <HistoryList
            histories={this.props.histories}
            onItemClick={this.props.onHistoryClick}
          />
          <div style={{
            display: 'flex',
          }}>
            <div style={{ width: '50%' }}>
              {commitFileList}
              {commitInfo}
            </div>
            <div style={{
              width: '50%',
              height: 300,
              overflow: 'auto',
              marginTop: 20,
              fontSize: 12,
            }}>
              <DiffPanel patches={this.props.diffPatches}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
