
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { HistoryList, CommitFileList, CommitInfo, DiffPanel } from '../../components'
import {
  initSearchHistoryPage,
  searchHistories,
  appendSearchHistories,
  loadCommitDiffFiles,
  loadCommitInfo,
  loadDiffLines,
} from '../../actions'

const styles = require('./SearchHistoryPage.scss')

let GLOBAL_REPO
let HISTORIES_COUNT = 50

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    histories: state.repo.histories,
    commitDiffFiles: state.repo.commitDiffFiles,
    diffPatches: state.repo.diffPatches,
    commitInfo: state.repo.commitInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onHistoryClick: (commitId) => {
      dispatch(loadCommitDiffFiles(GLOBAL_REPO, commitId))
      dispatch(loadCommitInfo(GLOBAL_REPO, commitId))
    },
    onHistoryScrollBottom: (keyword, type) => {
      dispatch(appendSearchHistories(GLOBAL_REPO, HISTORIES_COUNT += 50, keyword, type))
    },
    onCommitDiffFileClick: (patch) => {
      dispatch(loadDiffLines(patch))
    },
    onSearchButtonClick: (repo, keyword, type) => {
      dispatch(searchHistories(repo, HISTORIES_COUNT, keyword, type))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class SearchHistoryPage extends Component {

  constructor(props) {
    super(props)
    this.mountInit = false
    this.type = 'msg'
    this.keyword = ''
  }

  componentWillMount() {
    const { repo, store } = this.props
    if (repo && store && !this.mountInit) {
      this.mountInit = true
      GLOBAL_REPO = repo
      store.dispatch(initSearchHistoryPage(HISTORIES_COUNT))
    }
  }

  onHistoryScrollBottom() {
    this.props.onHistoryScrollBottom(this.keyword, this.type)
  }

  onSearchButtonClick() {
    this.props.onSearchButtonClick(GLOBAL_REPO, this.keyword, this.type)
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
      />:''

    return (
      <div className={styles.historyPage} key={'search-history-page'}>
        <div className={styles.searchArea}>
          <input type="text" id="search-keyword" className={styles.inputText} placeholder="输入你要搜索的内容" onChange={(e) => {
            this.keyword = e.target.value
          }}/>
          <label className={styles.label}>搜索:</label>
          <select value={this.type} onChange={(e) => {
            this.type = e.target.value
            this.forceUpdate()
          }}>
            <option value="msg">提交信息</option>
            <option value="sha">提交 SHA</option>
            <option value="committer">用户</option>
          </select>
          <button className={styles.button} onClick={::this.onSearchButtonClick}>search</button>
        </div>
        <HistoryList
          histories={this.props.histories}
          onItemClick={this.props.onHistoryClick}
          onScrollBottom={::this.onHistoryScrollBottom}
          prefix={`search-history-page-${this.props.params.project}`}
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
